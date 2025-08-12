<script>
	import { SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import { getContext } from 'svelte';

	// props
	let { ...rest } = $props();

	// get context
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);
</script>

<swappable_components.text {...rest} />
