<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	const { Story } = defineMeta({
		component: Form,
		title: 'Field Types/Date',
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
					name: 'Birth Date',
					fieldtype: 'date'
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
					name: 'Birth Date',
					fieldtype: 'date',
					label: 'When were you born?'
				}
			]
		}
	}}
></Story>

<Story
	name="With pre-selected date"
	args={{
		config: {
			fields: [
				{
					name: 'Event Date',
					fieldtype: 'date',
					label: 'Select event date'
				}
			]
		},
		context: {
			data: {
				event_date: '2025-12-25'
			}
		}
	}}
></Story>

<Story
	name="With hidden label"
	args={{
		config: {
			fields: [
				{
					name: 'Birth Date',
					fieldtype: 'date',
					label: 'When were you born?',
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
					name: 'Event Date',
					fieldtype: 'date',
					label: 'Event date (must be in the future)',
					validations: [
						{
							expression: '[[jsonata]]$exists(data.event_date)',
							error_message: 'Please select a date'
						},
						{
							expression: '[[jsonata]]$toMillis(data.event_date) > $millis()',
							error_message: 'Event date must be in the future'
						}
					],
					template_dependencies: ['data.event_date']
				}
			]
		}
	}}
></Story>

<Story
	name="Date range validation"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'Birth Date',
					fieldtype: 'date',
					label: 'Birth date (must be at least 18 years ago)',
					validations: [
						{
							expression: '[[jsonata]]$exists(data.birth_date)',
							error_message: 'Please select your birth date'
						},
						{
							expression: '[[jsonata]]$millis() - $toMillis(data.birth_date) >= (18 * 365.25 * 24 * 60 * 60 * 1000)',
							error_message: 'You must be at least 18 years old'
						}
					],
					template_dependencies: ['data.birth_date']
				}
			]
		}
	}}
></Story>

<Story
	name="Dynamic default date"
	args={{
		config: {
			fields: [
				{
					name: 'Appointment Date',
					fieldtype: 'date',
					label: 'Preferred appointment date',
					default: '[[jsonata]]$fromMillis($millis() + (7 * 24 * 60 * 60 * 1000), "[Y0001]-[M01]-[D01]")'
				}
			]
		}
	}}
></Story>
