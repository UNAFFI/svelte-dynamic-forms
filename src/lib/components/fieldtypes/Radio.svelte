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
		const current_value = rest.data_root[rest.definition.data_key];
		return rest.state_root?.options.map((/** @type {any} */ option) => ({
			label: option.label,
			value: option.value,
			is_selected: current_value === option.value
		}));
	});
	const selectedOption = $derived.by(() => {
		return options?.find((/** @type {any} */ option) => option.value === rest.data_root[rest.definition.data_key]);
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
	function selectOption(/** @type {any} */ option) {
		rest.data_root[rest.definition.data_key] = option.value;
	}
</script>

{#if options}
	<swappable_components.radio {selectOption} {label} {placeholder} {options} {...rest} />
{/if}
