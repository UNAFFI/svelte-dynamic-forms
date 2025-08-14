<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	const { Story } = defineMeta({
		component: Form,
		title: 'Field Types/Datetime',
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
					name: 'Appointment Time',
					fieldtype: 'datetime'
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
					name: 'Appointment Time',
					fieldtype: 'datetime',
					label: 'When would you like to schedule your appointment?'
				}
			]
		}
	}}
></Story>

<Story
	name="With pre-selected datetime"
	args={{
		config: {
			fields: [
				{
					name: 'Meeting Time',
					fieldtype: 'datetime',
					label: 'Select meeting time'
				}
			]
		},
		context: {
			data: {
				meeting_time: '2025-12-25T14:30'
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
					name: 'Appointment Time',
					fieldtype: 'datetime',
					label: 'When would you like to schedule your appointment?',
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
					name: 'Event Start Time',
					fieldtype: 'datetime',
					label: 'Event start time (must be in the future)',
					validations: [
						{
							expression: '[[jsonata]]$exists(data.event_start_time)',
							error_message: 'Please select a date and time'
						},
						{
							expression: '[[jsonata]]$toMillis(data.event_start_time & ":00.000Z") > $millis()',
							error_message: 'Event start time must be in the future'
						}
					],
					template_dependencies: ['data.event_start_time']
				}
			]
		}
	}}
></Story>

<Story
	name="Business hours validation"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'Appointment Time',
					fieldtype: 'datetime',
					label: 'Appointment time (business hours: 9 AM - 5 PM, Mon-Fri)',
					validations: [
						{
							expression: '[[jsonata]]$exists(data.appointment_time)',
							error_message: 'Please select an appointment time'
						},
						{
							expression: '[[jsonata]]$formatDateTime($toMillis(data.appointment_time & ":00.000Z"), "[F1]") in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]',
							error_message: 'Appointments are only available Monday through Friday'
						},
						{
							expression: '[[jsonata]]$number($formatDateTime($toMillis(data.appointment_time & ":00.000Z"), "[H01]")) >= 9 and $number($formatDateTime($toMillis(data.appointment_time & ":00.000Z"), "[H01]")) < 17',
							error_message: 'Appointments are only available between 9 AM and 5 PM'
						}
					],
					template_dependencies: ['data.appointment_time']
				}
			]
		}
	}}
></Story>

<Story
	name="Date range with time validation"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'Conference Start Time',
					fieldtype: 'datetime',
					label: 'Conference start time'
				},
				{
					name: 'Conference End Time',
					fieldtype: 'datetime',
					label: 'Conference end time (must be after start time)',
					validations: [
						{
							expression: '[[jsonata]]$exists(data.conference_end_time)',
							error_message: 'Please select an end time'
						},
						{
							expression: '[[jsonata]]$toMillis(data.conference_end_time & ":00.000Z") > $toMillis(data.conference_start_time & ":00.000Z")',
							error_message: 'End time must be after start time'
						},
						{
							expression: '[[jsonata]]$toMillis(data.conference_end_time & ":00.000Z") - $toMillis(data.conference_start_time & ":00.000Z") <= (8 * 60 * 60 * 1000)',
							error_message: 'Conference cannot be longer than 8 hours'
						}
					],
					template_dependencies: ['data.conference_end_time', 'data.conference_start_time']
				}
			]
		}
	}}
></Story>

<Story
	name="Dynamic default datetime"
	args={{
		config: {
			fields: [
				{
					name: 'Reminder Time',
					fieldtype: 'datetime',
					label: 'Set reminder time',
					default: '[[jsonata]]$fromMillis($millis() + (24 * 60 * 60 * 1000), "[Y0001]-[M01]-[D01]T[H01]:[m01]")'
				}
			]
		}
	}}
></Story>
