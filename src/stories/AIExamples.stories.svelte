<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	const { Story } = defineMeta({
		component: Form,
		title: 'General/AI Examples',
		tags: ['!autodocs'],
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
	name="Tennis Tournament Signup Form"
	args={{
		config: {
			fields: [
				{
					fieldtype: 'heading',
					content: 'Tennis Tournament Signup'
				},
				{
					fieldtype: 'text',
					name: 'full_name',
					label: 'Full Name',
					placeholder: 'Enter your full name'
				},
				{
					fieldtype: 'text',
					name: 'email',
					label: 'Email Address',
					placeholder: 'Enter your email'
				},
				{
					fieldtype: 'fieldset',
					label: 'Player Details',
					fields: [
						{
							fieldtype: 'text',
							name: 'age',
							label: 'Age',
							placeholder: 'Enter your age'
						},
						{
							fieldtype: 'array',
							name: 'emergency_contacts',
							label: 'Emergency Contacts',
							array_item_config: {
								fields: [
									{
										fieldtype: 'text',
										name: 'contact_name',
										label: 'Contact Name'
									},
									{
										fieldtype: 'text',
										name: 'contact_phone',
										label: 'Contact Phone'
									}
								]
							}
						}
					]
				},
				{
					fieldtype: 'html',
					content:
						'<p style="margin:0">By signing up, you agree to the tournament rules and privacy policy.</p>'
				}
			]
		}
	}}
></Story>

<Story
	name="Registration Form with Conditional Logic"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'Account Type',
					fieldtype: 'text',
					placeholder: 'personal or business'
				},
				{
					name: 'Personal Information',
					fieldtype: 'fieldset',
					conditions: [{ expression: '[[jsonata]]data.account_type = "personal"' }],
					template_dependencies: ['data.account_type'], // Required for condition to re-evaluate
					fields: [
						{ name: 'First Name', fieldtype: 'text' },
						{ name: 'Last Name', fieldtype: 'text' }
					]
				},
				{
					name: 'Business Information',
					fieldtype: 'fieldset',
					conditions: [{ expression: '[[jsonata]]data.account_type = "business"' }],
					template_dependencies: ['data.account_type'], // Required for condition to re-evaluate
					fields: [
						{ name: 'Company Name', fieldtype: 'text' },
						{ name: 'Tax ID', fieldtype: 'text' }
					]
				}
			]
		}
	}}
></Story>

<Story
	name="Dynamic Survey Form"
	args={{
		config: {
			fields: [
				{
					name: 'Survey Title',
					fieldtype: 'heading',
					content: 'Customer Satisfaction Survey'
				},
				{
					name: 'Questions',
					fieldtype: 'array',
					array_item_config: {
						fields: [
							{
								name: 'Question',
								fieldtype: 'text',
								placeholder: 'Enter your question'
							},
							{
								name: 'Response',
								fieldtype: 'text',
								placeholder: 'Your answer'
							}
						]
					}
				},
				{
					name: 'Summary',
					fieldtype: 'html',
					content: 'You have answered {{data.questions.length}} questions',
					template_dependencies: ['data.questions']
				}
			]
		}
	}}
></Story>
