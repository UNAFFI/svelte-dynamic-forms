<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	const { Story } = defineMeta({
		component: Form,
		title: 'Field Types/Tel',
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

<!-- Basic telephone input field -->
<Story
	name="Basic Example"
	args={{
		config: {
			fields: [
				{
					name: 'Phone Number',
					fieldtype: 'tel',
					label: 'Enter your phone number'
				}
			]
		}
	}}
></Story>

<!-- Tel field with placeholder -->
<Story
	name="With Placeholder"
	args={{
		config: {
			fields: [
				{
					name: 'Contact Number',
					fieldtype: 'tel',
					label: 'Contact phone number',
					placeholder: 'Enter your phone number'
				}
			]
		}
	}}
></Story>

<!-- Tel field with validation -->
<Story
	name="With Validation"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'Mobile Number',
					fieldtype: 'tel',
					label: 'Mobile number (required)',
					placeholder: 'Enter your mobile number',
					validations: [
						{
							expression: '[[jsonata]]$exists(data.mobile_number)',
							error_message: 'Mobile number is required'
						},
						{
							expression: '[[jsonata]]$length($trim(data.mobile_number)) >= 10',
							error_message: 'Please enter a valid phone number'
						}
					],
					template_dependencies: ['data.mobile_number']
				}
			]
		}
	}}
></Story>

<!-- Tel field with conditional display -->
<Story
	name="Conditional Tel Field"
	args={{
		config: {
			fields: [
				{
					name: 'Contact Method',
					fieldtype: 'select',
					options: [
						{ label: 'Email', value: 'email' },
						{ label: 'Phone', value: 'phone' },
						{ label: 'SMS', value: 'sms' }
					]
				},
				{
					name: 'Phone Number',
					fieldtype: 'tel',
					label: 'Your phone number',
					placeholder: 'Enter phone number',
					conditions: [
						{
							expression: '[[jsonata]]data.contact_method in ["phone", "sms"]'
						}
					],
					template_dependencies: ['data.contact_method']
				}
			]
		}
	}}
></Story>

<!-- Multiple tel fields for different purposes -->
<Story
	name="Multiple Tel Fields"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'Contact Information',
					fieldtype: 'fieldset',
					fields: [
						{
							name: 'Primary Phone',
							fieldtype: 'tel',
							label: 'Primary phone number',
							placeholder: 'Your main phone number',
							validations: [
								{
									expression: '[[jsonata]]$exists(data.primary_phone)',
									error_message: 'Primary phone number is required'
								}
							],
							template_dependencies: ['data.primary_phone']
						},
						{
							name: 'Secondary Phone',
							fieldtype: 'tel',
							label: 'Secondary phone number (optional)',
							placeholder: 'Alternative phone number'
						},
						{
							name: 'Emergency Contact',
							fieldtype: 'tel',
							label: 'Emergency contact number',
							placeholder: 'Emergency contact phone',
							validations: [
								{
									expression: '[[jsonata]]$exists(data.emergency_contact)',
									error_message: 'Emergency contact is required'
								},
								{
									expression: '[[jsonata]]data.emergency_contact != data.primary_phone',
									error_message: 'Emergency contact must be different from primary phone'
								}
							],
							template_dependencies: ['data.emergency_contact', 'data.primary_phone']
						}
					]
				}
			]
		}
	}}
></Story>

<!-- Tel field with international format validation -->
<Story
	name="International Format"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'International Phone',
					fieldtype: 'tel',
					label: 'International phone number',
					placeholder: 'Select country and enter number',
					validations: [
						{
							expression: '[[jsonata]]$exists(data.international_phone)',
							error_message: 'Phone number is required'
						},
						{
							expression: '[[jsonata]]$substring(data.international_phone, 0, 1) = "+"',
							error_message: 'Please include country code'
						},
						{
							expression: '[[jsonata]]$length($replace(data.international_phone, /[^0-9]/g, "")) >= 7',
							error_message: 'Phone number must have at least 7 digits'
						}
					],
					template_dependencies: ['data.international_phone']
				}
			]
		}
	}}
></Story>
