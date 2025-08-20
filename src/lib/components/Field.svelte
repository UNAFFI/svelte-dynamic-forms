<script>
	// imports
	import { SETTINGS, METADATA, DATA, COMPONENTS, DEFAULT_VALUES, CONTEXT } from '../symbols';
	import { getContext, onDestroy, onMount, untrack } from 'svelte';
	import { debounce, evaluateTemplate, randomId, stringToSnakeCase } from '../utils';

	// props
	/** @type {FieldProps}*/
	let { field_metadata = $bindable(), field_data = $bindable(), ...rest } = $props();

	// constants
	const handleDependencyChangeDebounced = debounce(handleDependencyChange, 300);

	// get context
	const settings = getContext(SETTINGS);
	const metadata = getContext(METADATA);
	const data = getContext(DATA);
	const context = getContext(CONTEXT);
	const components = getContext(COMPONENTS);
	const default_values = getContext(DEFAULT_VALUES);

	// set state
	let DynamicComponent = $state();

	// derived state
	const evaluation_context = $derived({
		context,
		data,
		metadata,
		settings,
		field_data,
		field_metadata
	});
	const dependency_values = $derived.by(() => {
		const result = [];
		if (field_metadata?.definition?.dependencies) {
			for (let path of field_metadata.definition.dependencies) {
				let value = evaluation_context;
				for (let part of path.split('.')) {
					if (!value) break;
					// @ts-ignore
					value = value[part];
				}
				result.push(value);
			}
		}
		return result;
	});

	// effects
	$effect(() => {
		dependency_values;

		untrack(() => {
			if (field_metadata && dependency_values) {
				field_metadata.dependencies_changed = true;

				handleDependencyChangeDebounced();
			}
		});
	});

	// on mount
	onMount(() => {
		initialize();
	});

	// on destroy
	onDestroy(() => {
		if (field_metadata?.field_id && metadata) {
			// remove the field from the metadata
			metadata[field_metadata.field_id] = undefined;
		}
	});

	// functions

	/**
	 * @param {string} field_id
	 */
	function getUniqueFieldId(field_id) {
		if (metadata?.[field_id]) return getUniqueFieldId(`${field_id}_${randomId()}`);
		return field_id;
	}

	async function initialize() {
		try {
			// check if this field is part of a form
			const is_form = !!settings?.form_id;

			// set fieldtype
			const fieldtype = await evaluateTemplate(rest?.fieldtype, evaluation_context);

			// set name
			let name = await evaluateTemplate(rest?.name, evaluation_context);
			if (!name) {
				console.warn(`${fieldtype}: "name" is missing, using ${fieldtype}`);
				if (fieldtype) name = fieldtype;
			}

			// set field_id
			const parent_field_id = rest.parent_field_id;
			let field_id = stringToSnakeCase(name) || randomId();
			if (parent_field_id) {
				field_id = `${parent_field_id}.${field_id}`;
			}

			// set the DynamicComponent
			if (rest.component) {
				DynamicComponent = rest.component;
			} else if (components?.[fieldtype]) {
				DynamicComponent = components[fieldtype];
			} else {
				throw new Error(`${field_id}: no component found for fieldtype ${fieldtype}`);
			}

			// set dependencies
			let dependencies = await evaluateTemplate(rest.dependencies, evaluation_context);
			if (!dependencies) dependencies = [];
			if (!Array.isArray(dependencies)) {
				throw new Error(`${field_id}: "dependencies" must be an array or evaluate to an array`);
			}
			/**
			 * make sure all dependencies are strings with no whitespace and only characters, numbers and dot (e.g. "data.first_name" or "data")
			 */
			const corrupted_dependency = dependencies.find((dep) => typeof dep !== 'string');
			if (corrupted_dependency) {
				throw new Error(
					`${field_id}: "dependencies" contains a corrupted dependency: ${corrupted_dependency}`
				);
			}

			// set keep_data_on_conditions_failed
			const keep_data_on_conditions_failed = Boolean(
				await evaluateTemplate(rest.keep_data_on_conditions_failed, evaluation_context)
			);

			// set data_path
			const parent_data_path = rest.parent_data_path;
			let data_path = await evaluateTemplate(rest.data_path, evaluation_context);
			if (is_form) {
				data_path = stringToSnakeCase(data_path || name);
			} else {
				if (data_path) {
					console.warn(`${field_id}: "data_path" can only be used in forms`);
				}
				data_path = stringToSnakeCase(name);
			}
			if (parent_data_path) {
				data_path = `${parent_data_path}.${data_path}`;
			}

			// set data_key
			const data_key = data_path.split('.').pop();
			if (!data_key) {
				throw new Error(`${field_id}: failed to extract "data_key"`);
			}

			// get default
			const default_value = await evaluateTemplate(rest.default_value, evaluation_context);

			// set settings
			const field_settings = await evaluateTemplate(rest.settings, evaluation_context);

			// set dynamic_settings
			const dynamic_settings = rest.dynamic_settings;

			// set validations
			let validations = rest.validations;
			if (!validations) validations = [];
			if (!Array.isArray(validations)) {
				throw new Error(`${field_id}: "validations" must be an array or evaluate to an array`);
			}
			const corrupted_validation = validations.find(
				(v) => typeof v.expression !== 'string' || typeof v.error_message !== 'string'
			);
			if (corrupted_validation) {
				throw new Error(
					`${field_id}: "validations" contains a corrupted validation: ${corrupted_validation}`
				);
			}

			// set conditions
			let conditions = rest.conditions;
			if (!conditions) conditions = [];
			if (!Array.isArray(conditions)) {
				throw new Error(`${field_id}: "conditions" must be an array or evaluate to an array`);
			}
			const corrupted_condition = conditions.find((c) => typeof c.expression !== 'string');
			if (corrupted_condition) {
				throw new Error(
					`${field_id}: "conditions" contains a corrupted condition: ${corrupted_condition}`
				);
			}

			// set init_value and field_data
			let current_step = is_form ? data : field_data;
			if (!current_step) current_step = {};
			let init_value;
			if (current_step !== undefined) {
				const keys = data_path.split('.');
				for (let i = 0; i < keys.length; i++) {
					const is_last = i === keys.length - 1;
					if (!is_last) {
						if (!current_step[keys[i]]) {
							current_step[keys[i]] = {};
						}
						current_step = current_step[keys[i]];
					} else {
						init_value = structuredClone($state.snapshot(current_step[keys[i]]));
						field_data = current_step;
					}
				}
			}

			// set field_metadata
			field_metadata = {
				field_id,
				data_key,
				init_value,
				default_value: default_value === undefined ? default_values?.[fieldtype] : default_value,
				validations: {},
				conditions: {},
				dependencies_changed: true,
				definition: {
					name,
					fieldtype,
					parent_field_id,
					dependencies,
					keep_data_on_conditions_failed,
					parent_data_path,
					data_path,
					default_value,
					settings: field_settings,
					dynamic_settings,
					validations,
					conditions
				}
			};

			// set the metadata
			if (metadata) {
				if (metadata[field_id]) {
					const updated_field_id = getUniqueFieldId(field_id);
					field_metadata.field_id = updated_field_id;
					field_metadata.definition.name = name + updated_field_id.slice(field_id.length);
					console.warn(
						`${field_id}: "field_id" is not unique, using "${updated_field_id}" instead.`
					);
				}
				metadata[field_metadata.field_id] = field_metadata;
			}
		} catch (err) {
			console.error(err);
		}
	}

	async function handleDependencyChange() {
		if (!field_metadata) return;
		console.log('Template dependencies changed for ', field_metadata?.field_id);

		// dynamic_settings
		if (field_metadata.definition.dynamic_settings) {
			field_metadata.dynamic_settings = await evaluateTemplate(
				field_metadata.definition.dynamic_settings,
				evaluation_context
			);
		}

		// validation
		/** @type {FieldMetadata["validations"]} */
		const validations = {
			is_valid: true,
			error_message: '',
			checks: [],
			previous_result: Boolean(field_metadata.validations?.previous_result)
		};
		if (field_metadata.definition.validations) {
			for (let i = 0; i < field_metadata.definition.validations?.length; i++) {
				const validation = field_metadata.definition.validations[i];
				const expression = validation?.expression;
				const error_message = validation?.error_message;
				const validation_result = await evaluateTemplate(expression, evaluation_context);
				if (validations.checks) {
					validations.checks.push({
						error_message,
						is_valid: Boolean(validation_result)
					});
				}
			}
			const first_validation_error = validations.checks?.find((check) => !check.is_valid);
			validations.is_valid = !first_validation_error;
			validations.error_message = first_validation_error?.error_message;
		}
		field_metadata.validations = validations;

		// conditions
		/** @type {FieldMetadata["conditions"]} */
		const conditions = {
			is_passed: true,
			previous_result: undefined
		};
		if (field_metadata.conditions?.is_passed !== undefined) {
			conditions.previous_result = Boolean(field_metadata.conditions?.is_passed);
		}
		if (field_metadata.definition.conditions) {
			for (let i = 0; i < field_metadata.definition.conditions.length; i++) {
				const condition = field_metadata.definition.conditions[i];
				const expression = condition?.expression;
				const condition_result = await evaluateTemplate(expression, evaluation_context);
				if (!Boolean(condition_result)) {
					conditions.is_passed = false;
					break;
				}
			}
		}
		field_metadata.conditions = conditions;

		// if conditions result changed then update the data
		if (field_metadata.conditions.is_passed !== field_metadata.conditions.previous_result) {
			if (field_metadata.definition.keep_data_on_conditions_failed !== true) {
				if (
					field_metadata.conditions.is_passed &&
					field_data &&
					field_data[field_metadata.data_key] === undefined
				) {
					field_data[field_metadata.data_key] =
						field_metadata.init_value ?? field_metadata.default_value;
				} else if (
					!field_metadata.conditions.is_passed &&
					field_data?.[field_metadata.data_key] !== undefined
				) {
					if (field_metadata.init_value !== undefined) {
						field_data[field_metadata.data_key] = field_metadata.init_value;
					} else {
						delete field_data?.[field_metadata.data_key];
					}
				}
			}
		}

		// set dependencies_changed
		field_metadata.dependencies_changed = false;
	}
</script>

{#if DynamicComponent && field_metadata?.conditions?.is_passed === true}
	<div id="{settings?.form_id ? settings?.form_id + '-' : ''}{field_metadata.field_id}">
		<DynamicComponent bind:field_metadata bind:field_data {settings} />
	</div>
{/if}
