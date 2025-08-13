<script>
	import { getContext } from 'svelte';
	import { SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import Field from '../Field.svelte';

	// get context
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);

	// props
	let { ...rest } = $props();

	// functions
	/**
	 * Move an item up in the array.
	 * @param {number} index
	 */
	function moveUp(index) {
		if (index > 0) {
			const item = rest.data_root[rest.definition.data_key][index];
			const neighbour = rest.data_root[rest.definition.data_key][index - 1];
			rest.data_root[rest.definition.data_key] = [
				...rest.data_root[rest.definition.data_key].slice(0, index - 1),
				item,
				neighbour,
				...rest.data_root[rest.definition.data_key].slice(index + 1)
			];
		}
	}

	/**
	 * Move an item down in the array.
	 * @param {number} index
	 */
	function moveDown(index) {
		if (index < rest.data_root[rest.definition.data_key].length - 1) {
			const item = rest.data_root[rest.definition.data_key][index];
			const neighbour = rest.data_root[rest.definition.data_key][index + 1];
			rest.data_root[rest.definition.data_key] = [
				...rest.data_root[rest.definition.data_key].slice(0, index),
				neighbour,
				item,
				...rest.data_root[rest.definition.data_key].slice(index + 2)
			];
		}
	}

	/**
	 * Remove an item from the array.
	 * @param {number} index
	 */
	function remove(index) {
		rest.data_root[rest.definition.data_key] = [
			...rest.data_root[rest.definition.data_key].slice(0, index),
			...rest.data_root[rest.definition.data_key].slice(index + 1)
		];
	}

	function add() {
		rest.data_root[rest.definition.data_key].push({});
	}
</script>

{#if rest.definition.array_item_config}
	<swappable_components.array
		field_component={Field}
		{add}
		{remove}
		{moveDown}
		{moveUp}
		{...rest}
	/>
{/if}
