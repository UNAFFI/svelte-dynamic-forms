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

<div class="time_component">
	<swappable_components._label {label} {...rest} />
	<input
		type="time"
		class={['time_input', is_display_error && 'invalid']}
		name={rest.definition.name}
		{placeholder}
		bind:value={rest.data_root[rest.definition.data_key]}
	/>
	<swappable_components._validation {...rest} />
</div>

<style>
	.time_component {
		display: flex;
		flex-direction: column;
		gap: 2px;
		width: 100%;
		margin-bottom: 16px;
		box-sizing: border-box;
	}

	.time_input {
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

	.time_input:focus {
		border-color: #1976d2; /* Material UI primary */
		box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.15);
	}

	.time_input.invalid {
		border-color: #d32f2f;
		background: #fff6f6;
	}

	.time_input:disabled {
		background: #f5f5f5;
		color: #bdbdbd;
		border-color: #e0e0e0;
		cursor: not-allowed;
	}

	/* Webkit browsers (Chrome, Safari, Edge) */
	.time_input::-webkit-calendar-picker-indicator {
		color: #1976d2;
		background: #f8f9fa url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231976d2'%3E%3Cpath d='M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z'/%3E%3C/svg%3E") no-repeat center;
		background-size: 14px 14px;
		border: 1px solid #e3e8ed;
		border-radius: 6px;
		cursor: pointer;
		padding: 6px;
		margin-left: 8px;
		transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
		width: 20px;
		height: 20px;
		opacity: 0.9;
	}

	.time_input::-webkit-calendar-picker-indicator:hover {
		background: #1976d2 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z'/%3E%3C/svg%3E") no-repeat center;
		background-size: 14px 14px;
		color: white;
		border-color: #1976d2;
		opacity: 1;
		transform: scale(1.05);
	}

	.time_input::-webkit-calendar-picker-indicator:focus {
		background: #1565c0 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z'/%3E%3C/svg%3E") no-repeat center;
		background-size: 14px 14px;
		color: white;
		border-color: #1565c0;
		outline: 2px solid rgba(25, 118, 210, 0.3);
		outline-offset: 2px;
		opacity: 1;
	}

	/* Firefox */
	.time_input::-moz-calendar-picker-indicator {
		color: #1976d2;
		background: #f8f9fa;
		border: 1px solid #e3e8ed;
		border-radius: 6px;
		cursor: pointer;
		padding: 6px;
		margin-left: 8px;
		transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
		opacity: 0.9;
	}

	.time_input::-moz-calendar-picker-indicator:hover {
		background: #1976d2;
		color: white;
		border-color: #1976d2;
		opacity: 1;
	}

	/* Clear button styling for time inputs */
	.time_input::-webkit-clear-button {
		-webkit-appearance: none;
		background: none;
		border: none;
		color: #666;
		cursor: pointer;
		font-size: 12px;
		padding: 2px;
		margin-left: 4px;
	}

	.time_input::-webkit-clear-button:hover {
		color: #333;
	}
</style>
