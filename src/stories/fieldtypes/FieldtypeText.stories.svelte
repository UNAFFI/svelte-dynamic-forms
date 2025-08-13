<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	const { Story } = defineMeta({
		component: Form,
		title: 'Field Types/Text',
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
					name: 'Full name',
					fieldtype: 'text'
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
					name: 'Full name',
					fieldtype: 'text',
					label: 'What is your full name?'
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
					name: 'Full name',
					fieldtype: 'text',
					placeholder: 'Enter your full name'
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
					name: 'Full name',
					fieldtype: 'text',
					label: 'What is your full name?',
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
					name: 'Full name',
					fieldtype: 'text',
					validations: [{ expression: '[[jsonata]]false', error_message: 'This will always be invalid' }]
				}
			]
		}
	}}
></Story>
