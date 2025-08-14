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

<div class="number_component">
	<swappable_components._label {label} {...rest} />
	<input
		type="number"
		class={['number_input', is_display_error && 'invalid']}
		name={rest.definition.name}
		{placeholder}
		step="any"
		bind:value={rest.data_root[rest.definition.data_key]}
	/>
	<swappable_components._validation {...rest} />
</div>

<style>
	.number_component {
		display: flex;
		flex-direction: column;
		gap: 2px;
		width: 100%;
		margin-bottom: 16px;
		box-sizing: border-box;
	}

	.number_input {
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
	}

	.number_input:focus {
		border-color: #1976d2; /* Material UI primary */
		box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.15);
	}

	.number_input.invalid {
		border-color: #d32f2f;
		background: #fff6f6;
	}

	.number_input:disabled {
		background: #f5f5f5;
		color: #bdbdbd;
		border-color: #e0e0e0;
		cursor: not-allowed;
	}

	/* Number input spinner styling */
	.number_input::-webkit-outer-spin-button,
	.number_input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	.number_input[type=number] {
		appearance: textfield;
		-moz-appearance: textfield;
	}

	/* Custom number input styling for better UX */
	.number_input::placeholder {
		color: #9e9e9e;
		opacity: 1;
	}

	.number_input:hover {
		border-color: #757575;
	}

	.number_input:focus::placeholder {
		color: #bdbdbd;
	}
</style>
