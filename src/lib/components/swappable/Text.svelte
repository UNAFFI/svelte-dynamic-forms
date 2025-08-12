<script>
	import { FORM_CONTEXT, SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import { getContext } from 'svelte';

	// props
	let { ...rest } = $props();

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

<div class="text_component">
	<swappable_components._label {...rest} />
	<input
		type="text"
		class={['text_input', is_display_error && 'invalid']}
		name={rest.definition.name}
		placeholder={rest.definition.placeholder}
		bind:value={rest.data_root[rest.definition.data_key]}
	/>
	<swappable_components._validation {...rest} />
</div>