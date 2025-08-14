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
	const filtered_options = $derived(options.filter((o) => !o.is_filtered_out));
	const selected_option = $derived(options.find((o) => o.is_selected));
</script>

<div class="select_component">
	<swappable_components._label {label} {...rest} />
	<div class="relative">
		<div class="current_option">
			{selected_option?.label}
		</div>
		<input
			type="text"
			class={['text_input', is_display_error && 'invalid']}
			name={rest.definition.name}
			{placeholder}
			bind:value={rest.state_root.select_filter_text}
		/>
		<div class="options_container">
			{#each filtered_options as option}
				<button
					class={['option', option.is_selected && 'is_selected']}
					onclick={() => selectOption(option)}
				>
					{option.label}
				</button>
			{/each}
		</div>
	</div>
	<swappable_components._validation {...rest} />
</div>
