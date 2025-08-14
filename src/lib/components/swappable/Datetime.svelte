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

<div class="datetime_component">
	<swappable_components._label {label} {...rest} />
	<input
		type="datetime-local"
		class={['datetime_input', is_display_error && 'invalid']}
		name={rest.definition.name}
		{placeholder}
		bind:value={rest.data_root[rest.definition.data_key]}
	/>
	<swappable_components._validation {...rest} />
</div>

<style>
	.datetime_component {
		display: flex;
		flex-direction: column;
		gap: 2px;
		width: 100%;
		margin-bottom: 16px;
		box-sizing: border-box;
	}

	.datetime_input {
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

	.datetime_input:focus {
		border-color: #1976d2; /* Material UI primary */
		box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.15);
	}

	.datetime_input.invalid {
		border-color: #d32f2f;
		background: #fff6f6;
	}

	.datetime_input:disabled {
		background: #f5f5f5;
		color: #bdbdbd;
		border-color: #e0e0e0;
		cursor: not-allowed;
	}

	/* Webkit browsers (Chrome, Safari, Edge) */
	.datetime_input::-webkit-calendar-picker-indicator {
		color: #666;
		background: none;
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
		transition: background-color 0.2s cubic-bezier(0.4,0,0.2,1);
	}

	.datetime_input::-webkit-calendar-picker-indicator:hover {
		background: #f0f0f0;
	}

	.datetime_input::-webkit-calendar-picker-indicator:focus {
		background: #e0e0e0;
		outline: 2px solid rgba(25, 118, 210, 0.15);
		outline-offset: 1px;
	}

	/* Firefox */
	.datetime_input::-moz-calendar-picker-indicator {
		color: #666;
		background: none;
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
		transition: background-color 0.2s cubic-bezier(0.4,0,0.2,1);
	}

	.datetime_input::-moz-calendar-picker-indicator:hover {
		background: #f0f0f0;
	}

	/* Clear button styling for datetime inputs */
	.datetime_input::-webkit-clear-button {
		-webkit-appearance: none;
		background: none;
		border: none;
		color: #666;
		cursor: pointer;
		font-size: 12px;
		padding: 2px;
		margin-left: 4px;
	}

	.datetime_input::-webkit-clear-button:hover {
		color: #333;
	}
</style>
