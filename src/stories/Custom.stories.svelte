<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';
	import CustomComponent from './CustomComponent.svelte';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Inputs/Custom',
		component: Form
	});
</script>

<Story
	name="Default"
	args={{
		config: {
			fields: [
				{
					name: 'Favorite Color',
					fieldtype: 'custom',
					custom_component_key: "_custom1",
					default: "''",
					dynamic_context: {
						color: "data.favorite_color"
					},
					validations: [
						{
							expression: "dynamic.color = 'Yellow'",
							error_message: "Color must be Yellow"
						}
					]
				}
			]
		},
		swappable_components: {
			_custom1: CustomComponent
		}
	}}
/>
