<script>
	import { FORM_CONTEXT, SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import { getContext, onMount, untrack } from 'svelte';
	import { JSONEditor } from 'svelte-jsoneditor';

	// props
	let { placeholder, label, ...rest } = $props();

	// get context
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);

	// set state
	let initialized = $state(false);
	let content = $state({
		json: undefined
	});

	// effects
	$effect(() => {
		rest.data_root[rest.definition.data_key];

		untrack(() => {
			content.json = rest.data_root[rest.definition.data_key] || {};
		});
	});

	$effect(() => {
		content.json;

		untrack(() => {
			rest.data_root[rest.definition.data_key] = content.json;
		});
	});

	onMount(() => {
		content.json = rest.data_root[rest.definition.data_key] || {};
		initialized = true;
	});
</script>

{#if initialized}
	<div class="json_component">
		<swappable_components._label {label} {...rest} />
		<div class="json_container">
			<JSONEditor bind:content />
		</div>
		<swappable_components._validation {...rest} />
	</div>
{/if}

<style>
	.json_component {
		display: flex;
		flex-direction: column;
		gap: 2px;
		width: 100%;
		margin-bottom: 16px;
	}

	.json_container {
		max-height: 300px; /* Adjust height as needed */
		height: 100%;
		width: 100%;
	}
</style>
