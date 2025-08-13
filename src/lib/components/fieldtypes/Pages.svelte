<script>
	import { getContext, onMount } from 'svelte';
	import Field from '../Field.svelte';
	import { SWAPPABLE_COMPONENTS } from '$lib/symbols';

	// props
	let { ...rest } = $props();

	// get context
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);

	// set state
	let initialized = $state(false);

	// derived state
	const current_page_index = $derived(rest.state_root.page_index);

	// on mount
	onMount(() => {
		rest.state_root.page_index = rest.state_root.page_index ?? 0;

		initialized = true;
	});

	// functions
	function next() {
		rest.state_root.page_index++;
	}

	function previous() {
		rest.state_root.page_index--;
	}
</script>

{#if initialized === true}
	{#key current_page_index}
		<swappable_components.pages
			{next}
			{previous}
			{current_page_index}
			field_component={Field}
			{...rest}
		/>
	{/key}
{/if}
