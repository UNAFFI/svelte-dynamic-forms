<script>
	// imports
	import jsonata from 'jsonata';
	import Mustache from 'mustache';
	import { getContext, onMount, untrack } from 'svelte';
	import { SWAPPABLE_COMPONENTS, FORM_CONTEXT } from '../symbols';
	import { debounce, getFormId, getKeyFromName } from '../utils';
	import fieldtypes from './fieldtypes';
	import default_values from '$lib/utils/default_values';

	// types
	/**
	 * @typedef {object} Props
	 * @property {FieldDefinition} definition - The definition of the field.
	 */

	// props
	/** @type {Props} */
	let { definition } = $props();

	// constants
	const handleTemplateDependenciesChangedDebounced = debounce(
		handleTemplateDependenciesChanged,
		200
	);

	// get context
	const context = getContext(FORM_CONTEXT);
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);

	// state
	/** @type {FormattedFieldDefinition | undefined} */
	let formatted_definition = $state();
	let field_config = $state();
	let data_root = $state();
	let state_root = $state();

	// derived state
	const template_dependencies = $derived.by(() => {
		/** @type {Record<string, any>} */
		const result = [];
		if (formatted_definition?.template_dependencies) {
			for (let path of formatted_definition.template_dependencies) {
				let value = context;
				for (let part of path.split('.')) {
					if (!value) break;
					value = value[part];
				}
				result.push(value);
			}
		}
		return result;
	});

	// effects
	$effect(() => {
		template_dependencies;

		untrack(() => {
			if (state_root) {
				state_root.is_validation_checked = false;
				state_root.is_conditions_checked = false;

				handleTemplateDependenciesChangedDebounced();
			}
		});
	});

	// on mount
	onMount(() => {
		initialize();

		return () => {
			if (formatted_definition?.state_path) {
				context.state[formatted_definition?.state_path] = undefined;
			}
		};
	});

	// functions
	async function initialize() {
		/** @type {FormattedFieldDefinition}*/
		// @ts-ignore
		const result = structuredClone($state.snapshot(definition));

		// ensure there is a fieldtype set
		if (!result.fieldtype) {
			throw new Error(
				`Field definition is missing "fieldtype" property: ${result.name || result.fieldtype}`
			);
		}

		// ensure it is a supported fieldtype
		const field_component = fieldtypes[result?.fieldtype];
		if (!field_component) {
			throw new Error(`Node type "${result?.fieldtype}" is not supported`);
		}

		// ensure the field has a name
		result.name = result.name || result.fieldtype;

		// set state_path
		result.state_path = getKeyFromName(result.name);
		if (result.parent_state_path) {
			result.state_path = `${result.parent_state_path}.${result.state_path}`;
		}
		if (context.state[result.state_path]) {
			result.state_path += `_${getFormId()}`;
		}

		// label and placeholder
		result.label = result.label || result.name;
		result.placeholder = result.placeholder || result.label;

		// set template_dependencies
		if (result.template_dependencies) {
			if (!Array.isArray(result.template_dependencies)) {
				throw new Error(
					`Field definition "template_dependencies" property must be an array: ${result.name || result.fieldtype}`
				);
			}
		}

		// set validations
		if (result.validations) {
			if (!Array.isArray(result.validations)) {
				throw new Error(
					`Field definition "validations" property must be an array: ${result.name || result.fieldtype}`
				);
			}
		}

		// set conditions
		if (result.conditions) {
			if (!Array.isArray(result.conditions)) {
				throw new Error(
					`Field definition "conditions" property must be an array: ${result.name || result.fieldtype}`
				);
			}
		}

		// set data_path
		result.data_path = getKeyFromName(result.data_path ?? result.name);
		if (result.parent_data_path) {
			// handle nested fields
			result.data_path = `${result.parent_data_path}.${result.data_path}`;
		}

		// set data_key
		result.data_key = result.data_path.split('.').pop() ?? '';

		// set fields
		if (result.fields) {
			if (!Array.isArray(result.fields)) {
				throw new Error(
					`Field definition "fields" property must be an array: ${result.name || result.fieldtype}`
				);
			}
			result.fields = result.fields.map((field) => ({
				...field,
				parent_data_path: result.data_path,
				parent_state_path: result.state_path
			}));
		}

		// set data_root in nested object (if necessary)
		data_root = context;
		let init_data;
		let default_data;
		const keys = result.data_path.split('.');
		for (let i = 0; i < keys.length; i++) {
			const is_last = i === keys.length - 1;
			if (!data_root[keys[i]]) {
				if (!is_last) {
					data_root[keys[i]] = {};
				}
			}
			if (!is_last) {
				data_root = data_root[keys[i]];
			} else {
				init_data = structuredClone($state.snapshot(data_root[keys[i]]));
			}
		}

		// get init_data
		if (init_data === undefined) {
			if (result.default !== undefined) {
				// default setting
				default_data = structuredClone(await interpolateTemplate(result.default));
			} else if (default_values[result.fieldtype] !== undefined) {
				// default from fieldtype
				default_data = structuredClone(default_values[result.fieldtype]);
			}
		}

		// set the field_config
		field_config = {
			component: field_component,
			init_data,
			default_data
		};

		// set the formatted definition
		formatted_definition = result;

		// set the state
		context.state[result.state_path] = {};
		state_root = context.state[result.state_path];
	}

	async function handleTemplateDependenciesChanged() {
		console.log('Template dependencies changed for ', formatted_definition?.state_path);

		if (
			!template_dependencies ||
			!formatted_definition ||
			!context.state[formatted_definition?.state_path]
		)
			return;

		const field_state = context.state[formatted_definition?.state_path];

		// additional_template_context
		if (formatted_definition?.template_context) {
			field_state.template_context = {};
			for (const [key, template] of Object.entries(formatted_definition.template_context)) {
				field_state.template_context[key] = await interpolateTemplate(template);
			}
		}

		// content
		field_state.content = await interpolateTemplate(formatted_definition.content);

		// placeholder
		field_state.placeholder = await interpolateTemplate(formatted_definition.placeholder);

		// label
		field_state.label = await interpolateTemplate(formatted_definition.label);

		// validation
		let is_valid = true;
		if (formatted_definition.validations) {
			const validation_checks = [];
			for (let i = 0; i < formatted_definition.validations?.length; i++) {
				const validation = formatted_definition.validations[i];
				const expression = validation?.expression;
				const error_message = validation?.error_message;
				const validation_result = await interpolateTemplate(expression);
				validation_checks.push({
					error_message,
					is_valid: Boolean(validation_result)
				});
			}
			const first_validation_error = validation_checks?.find((check) => !check.is_valid);
			is_valid = !first_validation_error;
			field_state.validation_error_message = first_validation_error?.error_message;
			field_state.validation_checks = validation_checks;
		}
		field_state.is_validation_checked = true;
		field_state.is_valid = is_valid;

		// conditions
		let is_conditions_passed = true;
		if (formatted_definition.conditions) {
			for (let i = 0; i < formatted_definition.conditions.length; i++) {
				const condition = formatted_definition.conditions[i];
				const expression = condition?.expression;
				const condition_result = await interpolateTemplate(expression);
				if (!Boolean(condition_result)) {
					is_conditions_passed = false;
					break;
				}
			}
		}
		field_state.is_conditions_checked = true;
		field_state.is_conditions_passed = is_conditions_passed;

		// if conditions result changed then update the data
		if (field_state.last_conditions_result !== is_conditions_passed) {
			if (formatted_definition?.keep_data_on_conditions_failed !== true) {
				if (is_conditions_passed && data_root[formatted_definition?.data_key] === undefined) {
					data_root[formatted_definition?.data_key] =
						field_config.init_data ?? field_config.default_data;
				} else if (
					!is_conditions_passed &&
					data_root[formatted_definition?.data_key] !== undefined
				) {
					if (field_config.init_data !== undefined) {
						data_root[formatted_definition?.data_key] = field_config.init_data;
					} else {
						delete data_root[formatted_definition?.data_key];
					}
				}
			}
			field_state.last_conditions_result = is_conditions_passed;
		}
	}

	/** @param {string} [template] */
	async function interpolateTemplate(template = '') {
		let result = '';
		try {
			// get the templating key from the start of the template (if any). The templating key is inside two square brackets like [[jsonata]] = templating language - jsonata
			const templating_key = template.match(/\[\[(.*?)\]\]/)?.[1];

			if (templating_key === 'jsonata') {
				const template_part = template.match(/\[\[jsonata\]\](.*)/)?.[1] ?? '';
				result = await jsonata(template_part).evaluate({
					...context,
					field_state:
						formatted_definition?.state_path && context.state[formatted_definition?.state_path]
				});
			} else {
				// @ts-ignore
				result = Mustache.render(template, {
					...context,
					field_state:
						formatted_definition?.state_path && context.state[formatted_definition?.state_path]
				});
			}
		} catch (err) {
			console.error(`Error interpolating template "${template}":`, err);
		}
		return result;
	}
</script>

{#if state_root?.is_conditions_passed === true}
	<div id="{context.form_id}-{formatted_definition?.state_path}">
		<swappable_components._fieldcontainer>
			<field_config.component bind:state_root bind:data_root definition={formatted_definition} />
		</swappable_components._fieldcontainer>
	</div>
{/if}
