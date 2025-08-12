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

<style>
		.label_component {
			display: inline-block;
			font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
			font-size: 0.97rem;
			font-weight: 500;
			color: #333;
			letter-spacing: 0.01em;
			line-height: 1.5;
			margin-bottom: 0.35em;
			transition: color 0.2s cubic-bezier(0.4,0,0.2,1);
			cursor: pointer;
			user-select: none;
		}
	.label_component.invalid {
		color: #d32f2f; /* Material UI error color */
	}
	.label_component.hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0,0,0,0);
		white-space: nowrap;
		border: 0;
	}
</style>
