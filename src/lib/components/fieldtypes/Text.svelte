<script>
	import { SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import { getContext } from 'svelte';

	// props
	let { ...rest } = $props();

	// get context
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);
	const label = $derived(rest.state_root?.dynamic_label || rest.definition.label || '');
	const placeholder = $derived(rest.state_root?.dynamic_placeholder || rest.definition.placeholder || '');
</script>

<swappable_components.text {label} {placeholder} {...rest} />
