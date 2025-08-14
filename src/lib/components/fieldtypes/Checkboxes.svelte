<script>
	import { SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import { getContext } from 'svelte';

	// props
	let { ...rest } = $props();

	// get context
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);
	const label = $derived(rest.state_root?.label || '');
	const placeholder = $derived(rest.state_root?.placeholder || '');
	const options = $derived.by(() => {
		if (!Array.isArray(rest.state_root?.options)) return null;
		const current_value = rest.data_root[rest.definition.data_key];
		return rest.state_root?.options.map((/** @type {any} */ option) => ({
			label: option.label,
			value: option.value,
			is_selected: current_value.find((/** @type {any} */ v) => v.value === option.value)
		}));
	});

	// functions
	function toggleOption(/** @type {any} */ option) {
		if (option.is_selected) {
			rest.data_root[rest.definition.data_key] = rest.data_root[rest.definition.data_key].filter(
				(/** @type {any} */ v) => v.value !== option.value
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
	<swappable_components.checkboxes {toggleOption} {clear} {label} {placeholder} {options} {...rest} />
{/if}
