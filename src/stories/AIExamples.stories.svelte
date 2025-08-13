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
					placeholder: 'Enter your full name',
				},
				{
					fieldtype: 'text',
					name: 'email',
					label: 'Email Address',
					placeholder: 'Enter your email',
				},
				{
					fieldtype: 'fieldset',
					label: 'Player Details',
					fields: [
						{
							fieldtype: 'text',
							name: 'age',
							label: 'Age',
							placeholder: 'Enter your age',
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
					content: '<p style="margin:0">By signing up, you agree to the tournament rules and privacy policy.</p>'
				}
			]
		}
	}}
></Story>
