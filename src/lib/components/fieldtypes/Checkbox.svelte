<script>
	import { SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import { getContext, onMount, untrack } from 'svelte';

	// props
	let { ...rest } = $props();

	// get context
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);
	const label = $derived(rest.state_root?.label || '');

	// effects
	$effect(() => {
		label;

		untrack(() => {
			rest.data_root[rest.definition.data_key + '_label'] = label;
		});
	});

	$effect(() => {
		const checked_value = rest.state_root?.checked_value;
		const unchecked_value = rest.state_root?.unchecked_value;

		untrack(() => {
			if (checked_value !== undefined && unchecked_value !== undefined) {
				const is_checked = rest.data_root[rest.definition.data_key] === checked_value;
				rest.data_root[rest.definition.data_key] = is_checked ? checked_value : unchecked_value;
			}
		});
	});

	// functions
	/**
	 * @param {Event & { currentTarget: EventTarget & HTMLInputElement }} event
	 */
	function toggle(event) {
		rest.data_root[rest.definition.data_key] = event.currentTarget.checked
			? rest.state_root.checked_value
			: rest.state_root.unchecked_value;
	}
</script>

<swappable_components.checkbox {toggle} {label} {...rest} />