<script>
	import { FORM_CONTEXT, SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import { getContext } from 'svelte';

	// props
	let { selectOption, options, placeholder, label, ...rest } = $props();

	// get context
	const context = getContext(FORM_CONTEXT);
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);

	// derived state
	const is_display_error = $derived(
		context.show_validation && // not hiding
			rest.state_root?.is_validation_checked && // is checked
			!rest.state_root?.is_valid // invalid
	);

	// functions
	function handleOptionClick(/** @type {any} */ option) {
		selectOption(option);
	}
</script>

<div class="radio_component">
	<swappable_components._label {label} {...rest} />
	<div class="radio_group" class:invalid={is_display_error}>
		{#each options as option}
			<label class="radio_option">
				<input
					type="radio"
					name={rest.definition.data_key}
					value={option.value}
					checked={option.is_selected}
					onchange={() => handleOptionClick(option)}
					class="radio_input"
				/>
				<span class="radio_custom"></span>
				<span class="radio_label">{option.label}</span>
			</label>
		{/each}
		{#if options.length === 0}
			<div class="no_options">No options available</div>
		{/if}
	</div>
	<swappable_components._validation {...rest} />
</div>

<style>
	.radio_component {
		display: flex;
		flex-direction: column;
		gap: 2px;
		width: 100%;
		margin-bottom: 16px;
		box-sizing: border-box;
	}

	.radio_group {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 8px 0;
	}

	.radio_group.invalid {
		border: 1px solid #d32f2f;
		border-radius: 4px;
		padding: 12px;
		background: #fff6f6;
	}

	.radio_option {
		display: flex;
		align-items: center;
		gap: 12px;
		cursor: pointer;
		padding: 8px 12px;
		border-radius: 4px;
		transition: background-color 0.2s cubic-bezier(0.4,0,0.2,1);
		position: relative;
		min-height: 44px; /* Ensure consistent height for touch targets */
	}

	.radio_option:hover {
		background: #f5f5f5;
	}

	.radio_input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
		margin: 0;
	}

	.radio_custom {
		width: 20px;
		height: 20px;
		border: 2px solid #bdbdbd;
		border-radius: 50%;
		background: #fff;
		transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
		position: relative;
		flex-shrink: 0;
	}

	.radio_custom::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(0);
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #1976d2;
		transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
	}

	.radio_input:checked + .radio_custom {
		border-color: #1976d2;
	}

	.radio_input:checked + .radio_custom::after {
		transform: translate(-50%, -50%) scale(1);
	}

	.radio_input:focus + .radio_custom {
		box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.15);
	}

	.radio_input:disabled + .radio_custom {
		background: #f5f5f5;
		border-color: #e0e0e0;
		cursor: not-allowed;
	}

	.radio_input:disabled + .radio_custom::after {
		background: #bdbdbd;
	}

	.radio_label {
		font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
		font-size: 1rem;
		font-weight: 400;
		color: #222;
		line-height: 1.4;
		flex: 1;
	}

	.radio_input:disabled ~ .radio_label {
		color: #bdbdbd;
		cursor: not-allowed;
	}

	.no_options {
		font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
		font-size: 1rem;
		color: #999;
		padding: 16px;
		text-align: center;
		font-style: italic;
	}
</style>
