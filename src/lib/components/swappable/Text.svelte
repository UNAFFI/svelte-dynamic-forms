<script>
	import { FORM_CONTEXT, SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import { getContext } from 'svelte';

	// props
	let { value = $bindable(), ...rest } = $props();

	// get context
	const context = getContext(FORM_CONTEXT);
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);

	// derived state
	const is_display_error = $derived(
		context.show_validation && // not hiding
			rest.state_root?.is_validation_checked && // is checked
			!rest.state_root?.is_valid // invalid
	);
</script>

<swappable_components._label {...rest} />
<input
	type="text"
	class={['text_component', is_display_error && 'invalid']}
	name={rest.definition.name}
	placeholder={rest.definition.placeholder}
	bind:value
/>
<swappable_components._validation {...rest} />

<style>
	.text_component {
		width: 100%;
		padding: 10px 12px;
		font-size: 16px;
		line-height: 1.5;
		color: rgba(0, 0, 0, 0.87);
		background-color: #fff;
		border: 1px solid rgba(0, 0, 0, 0.23);
		border-radius: 4px;
		box-sizing: border-box;
		outline: none;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
		font-family: Roboto, Arial, sans-serif;
	}

	.text_component:hover {
		border-color: rgba(0, 0, 0, 0.87);
	}

	.text_component:focus {
		border-color: #1976d2; /* Material primary blue */
		box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.25);
	}

	.text_component.invalid {
		border-color: #d32f2f; /* Material red */
		box-shadow: 0 0 0 2px rgba(211, 47, 47, 0.25);
	}
</style>
