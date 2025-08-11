<script>
	import { FORM_CONTEXT } from '$lib/symbols';
	import { getContext } from 'svelte';

	// props
	let { ...rest } = $props();

	// get context
	const context = getContext(FORM_CONTEXT);

	// derived state
	const is_display_error = $derived(
		context.show_validation && // not hiding
			rest.state_root?.is_validation_checked && // is checked
			!rest.state_root?.is_valid // invalid
	);
</script>

<label
	class={['label_component', is_display_error && 'invalid', rest.definition.hide_label && 'hidden']}
	for={rest.definition.name}
>
	{rest.definition.label}
</label>

<style>
	.label_component {
		display: block;
		font-size: 0.875rem; /* 14px */
		font-weight: 400;
		line-height: 1.43;
		color: rgba(0, 0, 0, 0.6);
		margin-bottom: 4px;
		font-family: Roboto, Arial, sans-serif;
		transition: color 0.2s ease;
	}

	.label_component.invalid {
		color: #d32f2f; /* Material red for errors */
	}
</style>
