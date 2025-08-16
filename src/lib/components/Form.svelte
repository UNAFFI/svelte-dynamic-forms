<script>
	// imports

	import { COMPONENTS, CONTEXT, DATA, DEFAULT_VALUES, METADATA, SETTINGS } from '../symbols';
	import { onMount, setContext } from 'svelte';
	import { randomId } from '$lib/utils';
	import Field from './Field.svelte';

	// props
	/** @type {FormProps}*/
	let {
		form_id,
		show_validation,
		fields,
		components = {},
		context = $bindable(),
		data = $bindable(),
		default_values = {},
		metadata = $bindable(),
		settings = $bindable(),
		// @ts-ignore
		children
	} = $props();

	// set state
	let is_initialized = $state(false);

	// on mount
	onMount(() => {
		initForm();

		// set context
		setContext(COMPONENTS, components);
		setContext(CONTEXT, context);
		setContext(DATA, data);
		setContext(DEFAULT_VALUES, default_values);
		setContext(METADATA, metadata);
		setContext(SETTINGS, settings);

		// set is_initialized
		is_initialized = true;
	});

	// functions
	function initForm() {
		if (!data) data = {}; // ensure data is an object
		metadata = {}; // reset metadata
		settings = {
			form_id: form_id || 'form_' + randomId(),
			validations: {}
		}; // reset settings
		settings.validations.is_show = Boolean(show_validation);
		settings.validations.max_time = 5000;
		settings.validations.check_interval = 100;
	}

	async function checkValidation() {
		if (!settings) return;
		settings.validations.issues = [];
		// loop through every metadata key and make sure that it is both checked and valid
		for (const field_id in metadata) {
			const field_metadata = metadata[field_id];
			if (field_metadata.dependencies_changed) {
				settings.validations.is_failed = true;
				break;
			} else {
				if (!field_metadata.validations.is_valid) {
					settings.validations.issues.push({
						field_id,
						error_message: field_metadata.validations.error_message
					});
				}
			}
		}

		if (settings.validations.is_failed) {
			if (!settings.validations.is_timeout) {
				await new Promise((resolve) => {
					setTimeout(() => {
						resolve(true);
					}, settings?.validations?.check_interval);
				});
				return checkValidation();
			}
		} else {
			settings.validations.is_valid = settings.validations.issues.length === 0;
		}

		return;
	}

	// This function is called from outside the form to enable pre-submit validation
	export async function validate() {
		if (!settings) return;
		const start_time = new Date().getTime();
		settings.validations.is_show = true;
		settings.validations.is_valid = false;
		settings.validations.is_failed = false;
		settings.validations.is_timeout = false;

		const timeout = setTimeout(() => {
			if (!settings) return;
			settings.validations.is_timeout = true;
		}, settings?.validations?.max_time);

		await checkValidation();

		if (!settings.validations.is_timeout) {
			clearTimeout(timeout);
			const end_time = new Date().getTime();
			settings.validations.duration = end_time - start_time;
		}

		return;
	}
</script>

{#if is_initialized === true}
	{#if fields}
		{#each fields as field}
			<Field {...field} />
		{/each}
	{:else}
		{@render children()}
	{/if}
{/if}
