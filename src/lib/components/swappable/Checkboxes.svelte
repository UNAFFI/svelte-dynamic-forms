<script>
	import { FORM_CONTEXT, SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import { getContext } from 'svelte';

	// props
	let { toggleOption, clear, options, placeholder, label, ...rest } = $props();

	// get context
	const context = getContext(FORM_CONTEXT);
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);

	// derived state
	const is_display_error = $derived(
		context.show_validation && // not hiding
			rest.state_root?.is_validation_checked && // is checked
			!rest.state_root?.is_valid // invalid
	);
	const selected_options = $derived(options.filter((/** @type {any} */ o) => o.is_selected));

	// functions
	function handleOptionClick(/** @type {any} */ option) {
		toggleOption(option);
	}

	function clearAll() {
		clear();
	}
</script>

<div class="checkboxes_component">
	<swappable_components._label {label} {...rest} />
	<div class="checkboxes_group" class:invalid={is_display_error}>
		{#each options as option}
			<label class="checkbox_option">
				<input
					type="checkbox"
					name={rest.definition.data_key}
					value={option.value}
					checked={option.is_selected}
					onchange={() => handleOptionClick(option)}
					class="checkbox_input"
				/>
				<span class="checkbox_custom"></span>
				<span class="checkbox_label">{option.label}</span>
			</label>
		{/each}
		{#if options.length === 0}
			<div class="no_options">No options available</div>
		{/if}
		{#if selected_options.length > 0}
			<div class="controls">
				<button
					type="button"
					class="clear_button"
					onclick={clearAll}
					aria-label="Clear all selections"
					title="Clear all selections"
				>
					Clear all ({selected_options.length})
				</button>
			</div>
		{/if}
	</div>
	<swappable_components._validation {...rest} />
</div>

<style>
	.checkboxes_component {
		display: flex;
		flex-direction: column;
		gap: 2px;
		width: 100%;
		margin-bottom: 16px;
		box-sizing: border-box;
	}

	.checkboxes_group {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 8px 0;
	}

	.checkboxes_group.invalid {
		border: 1px solid #d32f2f;
		border-radius: 4px;
		padding: 12px;
		background: #fff6f6;
	}

	.checkbox_option {
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

	.checkbox_option:hover {
		background: #f5f5f5;
	}

	.checkbox_input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
		margin: 0;
	}

	.checkbox_custom {
		width: 20px;
		height: 20px;
		border: 2px solid #bdbdbd;
		border-radius: 3px;
		background: #fff;
		transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
		position: relative;
		flex-shrink: 0;
	}

	.checkbox_custom::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(0);
		width: 12px;
		height: 12px;
		background: #1976d2;
		mask: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-10 10a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L3.5 12.293l9.646-9.647a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e") no-repeat center / contain;
		transition: transform 0.2s cubic-bezier(0.4,0,0.2,1);
	}

	.checkbox_input:checked + .checkbox_custom {
		border-color: #1976d2;
		background: #1976d2;
	}

	.checkbox_input:checked + .checkbox_custom::after {
		transform: translate(-50%, -50%) scale(1);
		background: white;
	}

	.checkbox_input:focus + .checkbox_custom {
		box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.15);
	}

	.checkbox_input:disabled + .checkbox_custom {
		background: #f5f5f5;
		border-color: #e0e0e0;
		cursor: not-allowed;
	}

	.checkbox_input:disabled + .checkbox_custom::after {
		background: #bdbdbd;
	}

	.checkbox_label {
		font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
		font-size: 1rem;
		font-weight: 400;
		color: #222;
		line-height: 1.4;
		flex: 1;
	}

	.checkbox_input:disabled ~ .checkbox_label {
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

	.controls {
		margin-top: 8px;
		padding: 8px 12px;
		border-top: 1px solid #f0f0f0;
	}

	.clear_button {
		font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.9rem;
		font-weight: 500;
		color: #1976d2;
		background: none;
		border: 1px solid #1976d2;
		border-radius: 4px;
		padding: 6px 12px;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
		outline: none;
	}

	.clear_button:hover {
		background: #1976d2;
		color: white;
	}

	.clear_button:focus {
		box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.15);
	}

	.clear_button:active {
		transform: translateY(1px);
	}
</style>
