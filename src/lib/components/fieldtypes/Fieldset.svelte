<script>
	import { SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import { getContext } from 'svelte';
	import Field from '../Field.svelte';

	// props
	let { ...rest } = $props();

	// get context
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);
</script>

{#key rest.fields}
	<swappable_components.fieldset field_component={Field} {...rest} />
{/key}
