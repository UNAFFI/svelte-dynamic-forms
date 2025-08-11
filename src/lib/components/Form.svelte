<script>
	// imports
	import { SWAPPABLE_COMPONENTS, FORM_CONTEXT } from '../symbols';
	import { onMount, setContext } from 'svelte';
	import Field from './Field.svelte';
	import swappable from './swappable';

	// props
	/** @type {FormProps} */
	let { context = $bindable({}), config, swappable_components = {} } = $props();

	// set context
	setContext(FORM_CONTEXT, context);
	setContext(SWAPPABLE_COMPONENTS, {
		...swappable,
		...swappable_components
	});

	// state
	let is_initialized = $state(false);

	// on mount
	onMount(() => {
		initForm();
	});

	// functions
	function initForm() {
		context.state = {};
		context.show_validation = Boolean(context.show_validation);
		is_initialized = true;
	}
</script>

{#if is_initialized === true}
	<Field
		definition={{
			...config,
			name: 'form',
			data_path: 'data',
			fieldtype: 'fieldset'
		}}
	/>
{/if}