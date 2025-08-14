<script>
	import { SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import { getContext } from 'svelte';

	// props
	let { ...rest } = $props();

	// get context
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);
	const label = $derived(rest.state_root?.label || '');
	const placeholder = $derived(rest.state_root?.placeholder || '');
</script>

<swappable_components.datetime {label} {placeholder} {...rest} />