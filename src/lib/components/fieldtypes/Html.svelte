<script>
	import { SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import { getContext } from 'svelte';

	// props
	let { ...rest } = $props();

	// get context
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);
	const content = $derived(rest.state_root?.dynamic_content || rest.definition.content || '');
</script>

<swappable_components.html {content} {...rest} />
