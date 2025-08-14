<script>
	import { FORM_CONTEXT, SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import { getContext } from 'svelte';

	// props
	let { placeholder, label, ...rest } = $props();

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

<div class="date_component">
	<swappable_components._label {label} {...rest} />
	<input
		type="date"
		class={['date_input', is_display_error && 'invalid']}
		name={rest.definition.name}
		{placeholder}
		bind:value={rest.data_root[rest.definition.data_key]}
	/>
	<swappable_components._validation {...rest} />
</div>

<style>
	.date_component {
		display: flex;
		flex-direction: column;
		gap: 2px;
		width: 100%;
		margin-bottom: 16px;
		box-sizing: border-box;
	}

	.date_input {
		font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
		font-size: 1rem;
		font-weight: 400;
		color: #222;
		background: #fff;
		border: 1px solid #bdbdbd;
		border-radius: 4px;
		padding: 10px 12px;
		outline: none;
		transition: border-color 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s cubic-bezier(0.4,0,0.2,1);
		box-shadow: 0 1px 2px rgba(60,60,60,0.02);
		width: 100%;
		box-sizing: border-box;
		cursor: pointer;
	}

	.date_input:focus {
		border-color: #1976d2; /* Material UI primary */
		box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.15);
	}

	.date_input.invalid {
		border-color: #d32f2f;
		background: #fff6f6;
	}

	.date_input:disabled {
		background: #f5f5f5;
		color: #bdbdbd;
		border-color: #e0e0e0;
		cursor: not-allowed;
	}

	/* Webkit browsers (Chrome, Safari, Edge) */
	.date_input::-webkit-calendar-picker-indicator {
		color: #666;
		background: none;
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
		transition: background-color 0.2s cubic-bezier(0.4,0,0.2,1);
	}

	.date_input::-webkit-calendar-picker-indicator:hover {
		background: #f0f0f0;
	}

	.date_input::-webkit-calendar-picker-indicator:focus {
		background: #e0e0e0;
		outline: 2px solid rgba(25, 118, 210, 0.15);
		outline-offset: 1px;
	}

	/* Firefox */
	.date_input::-moz-calendar-picker-indicator {
		color: #666;
		background: none;
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
		transition: background-color 0.2s cubic-bezier(0.4,0,0.2,1);
	}

	.date_input::-moz-calendar-picker-indicator:hover {
		background: #f0f0f0;
	}
</style>
