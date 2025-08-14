<script>
	import { FORM_CONTEXT, SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import { getContext } from 'svelte';

	// props
	let { toggle, label, ...rest } = $props();

	// get context
	const context = getContext(FORM_CONTEXT);
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);

	// derived state
	const is_display_error = $derived(
		context.show_validation && // not hiding
			rest.state_root?.is_validation_checked && // is checked
			!rest.state_root?.is_valid // invalid
	);

	// computed checked state
	const is_checked = $derived(
		rest.data_root[rest.definition.data_key] === rest.state_root.checked_value
	);
</script>

<div class="checkbox_component">
	<label class="checkbox_wrapper" class:invalid={is_display_error}>
		<input
			type="checkbox"
			class="checkbox_input"
			name={rest.definition.name}
			checked={is_checked}
			onchange={toggle}
		/>
		<span class="checkbox_custom"></span>
		<span class="checkbox_label">{label}</span>
	</label>
	<swappable_components._validation {...rest} />
</div>

<style>
	.checkbox_component {
		display: flex;
		flex-direction: column;
		gap: 2px;
		width: 100%;
		margin-bottom: 16px;
		box-sizing: border-box;
	}

	.checkbox_wrapper {
		display: flex;
		align-items: center;
		gap: 12px;
		position: relative;
		cursor: pointer;
		user-select: none;
		padding: 8px 0;
	}

	.checkbox_wrapper:hover .checkbox_custom {
		border-color: #757575;
		background: #fafafa;
	}

	.checkbox_wrapper.invalid .checkbox_custom {
		border-color: #d32f2f;
		background: #fff6f6;
	}

	.checkbox_input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;
	}

	.checkbox_custom {
		position: relative;
		height: 18px;
		width: 18px;
		background: #fff;
		border: 2px solid #bdbdbd;
		border-radius: 3px;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		flex-shrink: 0;
		display: block;
	}

	.checkbox_input:checked + .checkbox_custom {
		background: #1976d2;
		border-color: #1976d2;
	}

	.checkbox_input:checked + .checkbox_custom::after {
		content: '';
		position: absolute;
		left: 5px;
		top: 1px;
		width: 4px;
		height: 10px;
		border: solid white;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}

	.checkbox_input:focus + .checkbox_custom {
		box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.15);
		outline: none;
	}

	.checkbox_input:disabled + .checkbox_custom {
		background: #f5f5f5;
		border-color: #e0e0e0;
		cursor: not-allowed;
	}

	.checkbox_input:disabled:checked + .checkbox_custom {
		background: #bdbdbd;
		border-color: #bdbdbd;
	}

	.checkbox_label {
		font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
		font-size: 1rem;
		font-weight: 400;
		color: #222;
		line-height: 1.5;
		flex: 1;
	}

	.checkbox_wrapper.invalid .checkbox_label {
		color: #d32f2f;
	}

	.checkbox_input:disabled ~ .checkbox_label {
		color: #bdbdbd;
		cursor: not-allowed;
	}

	/* Additional hover states */
	.checkbox_wrapper:hover .checkbox_input:not(:disabled):not(:checked) + .checkbox_custom {
		border-color: #1976d2;
	}

	.checkbox_wrapper:hover .checkbox_input:checked + .checkbox_custom {
		background: #1565c0;
		border-color: #1565c0;
	}
</style>
