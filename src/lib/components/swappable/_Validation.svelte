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
	const validation_error_message = $derived(
		is_display_error && rest.state_root?.validation_error_message
	);
</script>

{#if validation_error_message}
	<div class="validation_component">
		{validation_error_message}
	</div>
{/if}