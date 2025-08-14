<script>
	import { SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import { getContext } from 'svelte';

	// props
	let { ...rest } = $props();

	// get context
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);
	const label = $derived(rest.state_root?.label || '');
</script>

<swappable_components.json {label} {...rest} />