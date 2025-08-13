<script>
	// imports
	import { SWAPPABLE_COMPONENTS, FORM_CONTEXT } from '../symbols';
	import { onMount, setContext } from 'svelte';
	import Field from './Field.svelte';
	import swappable from './swappable';
	import { getFormId } from '$lib/utils';

	// props
	/** @type {FormProps} */
	let { context = $bindable({}), config = {}, swappable_components = {} } = $props();

	// constants
	const MAX_VALIDATION_TIME = 5000; // Validation should not take longer than 5 seconds
	const VALIDATION_CHECK_INTERVAL = 100; // Try validation 100 ms apart
	let is_validation_time_exceeded = false; // If true, validation took too long

	// set context
	setContext(FORM_CONTEXT, context);
	setContext(SWAPPABLE_COMPONENTS, {
		...swappable,
		...swappable_components
	});

	// state
	let is_initialized = $state(false);

	// on mount
	onMount(() => {
		initForm();
	});

	// functions
	function initForm() {
		context.state = {}; // Initialize the state for all fields
		context.show_validation = Boolean(config.show_validation); // Whether to show validation messages
		context.form_id = config.form_id || getFormId(); // The unique identifier for the form
		is_initialized = true; // Set to true so the form can render
	}

	// This function gets called recursively until all fields are validated or the timeout is reached
	/** @returns {Promise<FormValidationResult>} */
	async function checkValidation() {
		// Initialize the result
		/** @type {FormValidationResult} */
		const result = {
			is_valid: false,
			is_validation_timeout: false,
			is_validation_failed: false,
			issues: []
		};
		// loop through every state key and make sure that it is both checked and valid
		for (const key in context.state) {
			const field_state = context.state[key];
			if (field_state.is_validation_checked) {
				if (!field_state.is_valid) {
					result.issues.push({
						state_path: key,
						error_message: field_state.validation_error_message
					});
				}
			} else {
				result.is_validation_failed = true;
				break;
			}
		}

		if (result.is_validation_failed) {
			if (is_validation_time_exceeded) {
				result.is_validation_timeout = true;
			} else {
				await new Promise((resolve) => {
					setTimeout(() => {
						resolve(true);
					}, VALIDATION_CHECK_INTERVAL);
				});
				return checkValidation();
			}
		} else {
			result.is_valid = result.issues.length === 0;
		}

		return result;
	}

	// This function is called from outside the form to enable pre-submit validation
	export async function validate() {
		context.show_validation = true;
		is_validation_time_exceeded = true;

		setTimeout(() => {
			is_validation_time_exceeded = true;
		}, MAX_VALIDATION_TIME);

		return await checkValidation();
	}
</script>

{#if is_initialized === true}
	<Field
		definition={{
			name: 'form',
			data_path: 'data',
			fieldtype: 'fieldset',
			fields: config.fields
		}}
	/>
{/if}
