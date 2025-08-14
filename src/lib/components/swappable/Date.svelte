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
		color: #1976d2;
		background: #f8f9fa url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231976d2'%3E%3Cpath d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z'/%3E%3C/svg%3E") no-repeat center;
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

	.date_input::-webkit-calendar-picker-indicator:hover {
		background: #1976d2 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z'/%3E%3C/svg%3E") no-repeat center;
		background-size: 14px 14px;
		color: white;
		border-color: #1976d2;
		opacity: 1;
		transform: scale(1.05);
	}

	.date_input::-webkit-calendar-picker-indicator:focus {
		background: #1565c0 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z'/%3E%3C/svg%3E") no-repeat center;
		background-size: 14px 14px;
		color: white;
		border-color: #1565c0;
		outline: 2px solid rgba(25, 118, 210, 0.3);
		outline-offset: 2px;
		opacity: 1;
	}

	/* Firefox */
	.date_input::-moz-calendar-picker-indicator {
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

	.date_input::-moz-calendar-picker-indicator:hover {
		background: #1976d2;
		color: white;
		border-color: #1976d2;
		opacity: 1;
	}
</style>
