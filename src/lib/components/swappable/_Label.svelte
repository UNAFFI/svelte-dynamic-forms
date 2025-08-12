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

{#if rest.definition.label}
	<label
		class={[
			'label_component',
			is_display_error && 'invalid',
			rest.definition.hide_label && 'hidden'
		]}
		for={rest.definition.name}
	>
		{rest.definition.label}
	</label>
{/if}
