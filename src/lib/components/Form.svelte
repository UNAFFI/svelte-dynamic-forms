<script>
	// imports
	import { SWAPPABLE_COMPONENTS, FORM_CONTEXT } from '../symbols';
	import { onMount, setContext } from 'svelte';
	import Field from './Field.svelte';
	import swappable from './swappable';
	import { getFormId } from '$lib/utils';

	// props
	/** @type {FormProps} */
	let { context = $bindable({}), config, swappable_components = {} } = $props();

	// constants
	const MAX_VALIDATION_TIME = 5000;
	const VALIDATION_CHECK_INTERVAL = 100;
	let is_validation_time_exceeded = false;

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
		context.state = {};
		context.show_validation = Boolean(context.show_validation);
		context.form_id = getFormId();
		is_initialized = true;
	}

	async function checkValidation() {
		// loop through every state key and make sure that it is both checked and valid
		const result = {
			is_valid: false,
			is_validation_timeout: false,
			is_validation_failed: false,
			issues: []
		};
		for (const key in context.state) {
			const field_state = context.state[key];
			if (field_state.is_validation_checked) {
				if (!field_state.is_valid) {
					// @ts-ignore
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
			...config,
			name: 'form',
			data_path: 'data',
			fieldtype: 'fieldset'
		}}
	/>
{/if}

Context:
<pre>
	{JSON.stringify(context, null, 2)}
</pre>
