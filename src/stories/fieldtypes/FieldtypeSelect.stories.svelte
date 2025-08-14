<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	const { Story } = defineMeta({
		component: Form,
		title: 'Field Types/Select',
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
					name: 'Favorite Color',
					fieldtype: 'select',
					options: [
						{
							label: 'Yellow',
							value: 'yellow'
						},
						{
							label: 'Green',
							value: 'green'
						},
						{
							label: 'Blue',
							value: 'blue'
						},
						{
							label: 'Red',
							value: 'red'
						}
					]
				}
			]
		}
	}}
></Story>
