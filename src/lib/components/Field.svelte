<script>
	// imports
	import { getContext, onMount, untrack } from 'svelte';
	import { SWAPPABLE_COMPONENTS, FORM_CONTEXT } from '../symbols';
	import { debounce, getKeyFromName } from '../utils';
	import jsonata from 'jsonata';
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
	const handleStateParamsChangeDebounced = debounce(handleStateParamsChange, 300);

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
	const state_params = $derived.by(() => {
		if (!formatted_definition?.state_params) return;
		const result = [];
		for (let param_expression of formatted_definition?.state_params ?? []) {
			let param = context;
			for (let part of param_expression.split('.')) {
				if (!param) break;
				param = param[part];
			}
			result.push(param);
		}
		return result;
	});

	// effects
	$effect(() => {
		state_params;

		untrack(() => {
			if (formatted_definition?.state_path) {
				if (context.state[formatted_definition?.state_path]) {
					context.state[formatted_definition?.state_path].is_validation_checked = false;
					context.state[formatted_definition?.state_path].is_conditions_checked = false;
				}

				handleStateParamsChangeDebounced();
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
				`Field definition is missing "fieldtype" property: ${JSON.stringify(result)}`
			);
		}

		// ensure it is a supported fieldtype
		const field_component = fieldtypes[result?.fieldtype];
		if (!field_component) {
			throw new Error(`Node type "${result?.fieldtype}" is not supported`);
		}

		// ensure the field has a name
		if (!result.name) {
			throw new Error(`Field definition is missing "name" property: ${JSON.stringify(result)}`);
		}
		result.label = result.label || result.name;
		result.placeholder = result.placeholder || result.label;

		// set state_path
		result.state_path = getKeyFromName(result.name);
		if (result.parent_state_path) {
			result.state_path = `${result.parent_state_path}.${result.state_path}`;
		}

		// set state_params
		if (!result.state_params) result.state_params = [];
		if (!Array.isArray(result.state_params)) {
			throw new Error(
				`Field definition "state_params" property must be an array: ${JSON.stringify(result)}`
			);
		}

		// set validations
		if (!result.validations) result.validations = [];
		if (!Array.isArray(result.validations)) {
			throw new Error(
				`Field definition "validations" property must be an array: ${JSON.stringify(result)}`
			);
		}

		// set conditions
		if (!result.conditions) result.conditions = [];
		if (!Array.isArray(result.conditions)) {
			throw new Error(
				`Field definition "conditions" property must be an array: ${JSON.stringify(result)}`
			);
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
		if (!result.fields) result.fields = [];
		if (!Array.isArray(result.fields)) {
			throw new Error(
				`Field definition "fields" property must be an array: ${JSON.stringify(result)}`
			);
		}
		result.fields = result.fields.map((field) => ({
			...field,
			parent_data_path: result.data_path,
			parent_state_path: result.state_path
		}));

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
			if (result.default) {
				// default setting
				default_data = structuredClone(await jsonata(result.default).evaluate(context));
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

	async function handleStateParamsChange() {
		console.log('State params changed for ', formatted_definition?.state_path);

		if (!state_params || !formatted_definition || !context.state[formatted_definition?.state_path])
			return;

		const field_state = context.state[formatted_definition?.state_path];

		// validation
		const validation_checks = [];
		const validations = formatted_definition.validations;
		for (let i = 0; i < validations?.length; i++) {
			const validation = validations[i];
			const expression = validation?.expression;
			const error_message = validation?.error_message;
			const validation_result = await jsonata(expression).evaluate({ params: state_params });
			validation_checks.push({
				error_message,
				is_valid: validation_result === true
			});
		}
		const first_validation_error = validation_checks?.find((check) => !check.is_valid);
		field_state.is_validation_checked = true;
		field_state.is_valid = !first_validation_error;
		field_state.validation_error_message = first_validation_error?.error_message;
		field_state.validation_checks = validation_checks;

		// conditions
		let is_conditions_passed = true;
		const conditions = formatted_definition.conditions;
		for (let i = 0; i < conditions?.length; i++) {
			const condition = conditions[i];
			const expression = condition?.expression;
			const condition_result = await jsonata(expression).evaluate({ params: state_params });
			if (condition_result !== true) {
				is_conditions_passed = false;
				break;
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
</script>

{#if state_root?.is_conditions_passed === true}
	<swappable_components._fieldcontainer>
		<field_config.component bind:state_root bind:data_root definition={formatted_definition} />
	</swappable_components._fieldcontainer>
{/if}
