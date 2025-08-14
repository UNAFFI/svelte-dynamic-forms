<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	const { Story } = defineMeta({
		component: Form,
		title: 'Field Types/Textarea',
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
					name: 'Description',
					fieldtype: 'textarea'
				}
			]
		}
	}}
></Story>

<Story
	name="With label"
	args={{
		config: {
			fields: [
				{
					name: 'Description',
					fieldtype: 'textarea',
					label: 'What is your description?'
				}
			]
		}
	}}
></Story>

<Story
	name="With placeholder"
	args={{
		config: {
			fields: [
				{
					name: 'Description',
					fieldtype: 'textarea',
					placeholder: 'Enter your description here...'
				}
			]
		}
	}}
></Story>

<Story
	name="With hidden label"
	args={{
		config: {
			fields: [
				{
					name: 'Description',
					fieldtype: 'textarea',
					label: 'What is your description?',
					hide_label: true
				}
			]
		}
	}}
></Story>

<Story
	name="With validation"
	args={{
		config: {
            show_validation: true,
			fields: [
				{
					name: 'Description',
					fieldtype: 'textarea',
					validations: [{ expression: '[[jsonata]]false', error_message: 'This will always be invalid' }]
				}
			]
		}
	}}
></Story>
