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
			is_selected: current_value.find((v) => v.value === option.value),
			is_filtered_out: !option.label.toLowerCase().includes(filter_text.toLowerCase())
		}));
	});

	// functions
	function toggleOption(option) {
		if (option.is_selected) {
			rest.data_root[rest.definition.data_key] = rest.data_root[rest.definition.data_key].filter(
				(v) => v.value !== option.value
			);
		} else {
			rest.data_root[rest.definition.data_key] = [
				...rest.data_root[rest.definition.data_key],
				{ value: option.value, label: option.label }
			];
		}
	}

    function clear() {
        rest.data_root[rest.definition.data_key] = [];
    }
</script>

{#if options}
	<swappable_components.multiselect {toggleOption} {clear} {label} {placeholder} {options} {...rest} />
{/if}