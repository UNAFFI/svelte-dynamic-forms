<script>
	import { SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import { getContext, untrack } from 'svelte';

	// props
	let { ...rest } = $props();

	// get context
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);
	const label = $derived(rest.state_root?.label || '');
	const placeholder = $derived(rest.state_root?.placeholder || '');
	const options = $derived.by(() => {
		if (!Array.isArray(rest.state_root?.options)) return null;
		const filter_text = rest.state_root.select_filter_text ?? '';
		const current_value = rest.data_root[rest.definition.data_key];
		return rest.state_root?.options.map((option) => ({
			label: option.label,
			value: option.value,
			is_selected: current_value === option.value,
			is_filtered_out: !option.label.toLowerCase().includes(filter_text.toLowerCase())
		}));
	});
	const selectedOption = $derived.by(() => {
		return options?.find((option) => option.value === rest.data_root[rest.definition.data_key]);
	});

	// effects
	$effect(() => {
		selectedOption;

		untrack(() => {
			if (
				selectedOption &&
				selectedOption.label !== rest.data_root[rest.definition.data_key + '_label']
			) {
				rest.data_root[rest.definition.data_key + '_label'] = selectedOption.label;
			}
		});
	});

	// functions
	function selectOption(option) {
		rest.data_root[rest.definition.data_key] = option.value;
	}
</script>

{#if options}
	<swappable_components.select {selectOption} {label} {placeholder} {options} {...rest} />
{/if}