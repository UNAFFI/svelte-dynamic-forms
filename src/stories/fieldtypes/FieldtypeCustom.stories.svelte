<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';
	import CustomComponent from '../CustomComponent.svelte';

	const { Story } = defineMeta({
		component: Form,
		title: 'Field Types/Custom',
		tags: ['autodocs'],
		argTypes: {
			context: {
				control: {
					type: 'object'
				},
				description: 'Bindable context data for the form.'
			},
			swappable_components: {
				control: {
					type: 'object'
				},
				description: 'Swappable components for the form.'
			},
			config: {
				control: {
					type: 'object'
				},
				description: 'Configuration options for the form.'
			}
		}
	});
</script>

<Story
	name="Example"
	args={{
		config: {
			fields: [
				{
					fieldtype: 'custom',
					custom_component_key: '_CustomComponent'
				}
			]
		},
		swappable_components: {
			_CustomComponent: CustomComponent
		}
	}}
></Story>