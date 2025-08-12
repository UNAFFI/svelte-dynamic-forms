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

<style>
		.validation_component {
			color: #d32f2f; /* Material UI error color */
			background: rgba(211, 47, 47, 0.04);
			font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
			font-size: 0.87rem;
			font-weight: 400;
			margin-top: 3px;
			margin-bottom: 0;
			padding: 5px 10px;
			border-radius: 4px;
			line-height: 1.5;
			letter-spacing: 0.01em;
			transition: background 0.2s cubic-bezier(0.4,0,0.2,1), color 0.2s cubic-bezier(0.4,0,0.2,1);
			box-sizing: border-box;
			min-height: 20px;
			display: block;
		}
</style>