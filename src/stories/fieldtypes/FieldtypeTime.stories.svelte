<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	const { Story } = defineMeta({
		component: Form,
		title: 'Field Types/Time',
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
					name: 'Meeting Time',
					fieldtype: 'time'
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
					name: 'Meeting Time',
					fieldtype: 'time',
					label: 'What time should we meet?'
				}
			]
		}
	}}
></Story>

<Story
	name="With pre-selected time"
	args={{
		config: {
			fields: [
				{
					name: 'Meeting Time',
					fieldtype: 'time',
					label: 'Meeting time'
				}
			]
		},
		context: {
			data: {
				meeting_time: '14:30'
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
					name: 'Meeting Time',
					fieldtype: 'time',
					label: 'What time should we meet?',
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
					name: 'Office Hours',
					fieldtype: 'time',
					label: 'Office opening time (8 AM - 10 AM)',
					validations: [
						{
							expression: '[[jsonata]]$exists(data.office_hours)',
							error_message: 'Please select an opening time'
						},
						{
							expression: '[[jsonata]]$toMillis("1970-01-01T" & data.office_hours & ":00.000Z") >= $toMillis("1970-01-01T08:00:00.000Z")',
							error_message: 'Office must open at or after 8:00 AM'
						},
						{
							expression: '[[jsonata]]$toMillis("1970-01-01T" & data.office_hours & ":00.000Z") <= $toMillis("1970-01-01T10:00:00.000Z")',
							error_message: 'Office must open by 10:00 AM'
						}
					],
					template_dependencies: ['data.office_hours']
				}
			]
		}
	}}
></Story>

<Story
	name="Time range validation"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'Start Time',
					fieldtype: 'time',
					label: 'Event start time'
				},
				{
					name: 'End Time',
					fieldtype: 'time',
					label: 'Event end time (must be after start time)',
					validations: [
						{
							expression: '[[jsonata]]$exists(data.end_time)',
							error_message: 'Please select an end time'
						},
						{
							expression: '[[jsonata]]$exists(data.start_time) ? $toMillis("1970-01-01T" & data.end_time & ":00.000Z") > $toMillis("1970-01-01T" & data.start_time & ":00.000Z") : true',
							error_message: 'End time must be after start time'
						}
					],
					template_dependencies: ['data.start_time', 'data.end_time']
				}
			]
		}
	}}
></Story>

<Story
	name="Business hours configuration"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'Office Open',
					fieldtype: 'time',
					label: 'Office opening time'
				},
				{
					name: 'Office Close',
					fieldtype: 'time',
					label: 'Office closing time',
					validations: [
						{
							expression: '[[jsonata]]$exists(data.office_open) ? $toMillis("1970-01-01T" & data.office_close & ":00.000Z") > $toMillis("1970-01-01T" & data.office_open & ":00.000Z") : true',
							error_message: 'Office must close after it opens'
						}
					],
					template_dependencies: ['data.office_open', 'data.office_close']
				},
				{
					name: 'Lunch Start',
					fieldtype: 'time',
					label: 'Lunch break start (optional)',
					validations: [
						{
							expression: '[[jsonata]]data.lunch_start = "" or ($exists(data.office_open) and $exists(data.office_close) ? ($toMillis("1970-01-01T" & data.lunch_start & ":00.000Z") > $toMillis("1970-01-01T" & data.office_open & ":00.000Z") and $toMillis("1970-01-01T" & data.lunch_start & ":00.000Z") < $toMillis("1970-01-01T" & data.office_close & ":00.000Z")) : true)',
							error_message: 'Lunch break must be during office hours'
						}
					],
					template_dependencies: ['data.office_open', 'data.office_close', 'data.lunch_start']
				}
			]
		}
	}}
></Story>
