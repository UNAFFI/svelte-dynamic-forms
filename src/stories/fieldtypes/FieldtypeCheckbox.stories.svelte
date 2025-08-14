<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	const { Story } = defineMeta({
		component: Form,
		title: 'Field Types/Checkbox',
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
					name: 'Agree to Terms',
					fieldtype: 'checkbox',
					label: 'I agree to the terms and conditions'
				}
			]
		}
	}}
></Story>

<Story
	name="With custom values"
	args={{
		config: {
			fields: [
				{
					name: 'Newsletter',
					fieldtype: 'checkbox',
					label: 'Subscribe to newsletter',
					checked_value: 'subscribed',
					unchecked_value: 'unsubscribed'
				}
			]
		}
	}}
></Story>

<Story
	name="With numeric values"
	args={{
		config: {
			fields: [
				{
					name: 'Premium Account',
					fieldtype: 'checkbox',
					label: 'Upgrade to premium account (+$10/month)',
					checked_value: 10,
					unchecked_value: 0
				}
			]
		}
	}}
></Story>

<Story
	name="Pre-checked"
	args={{
		config: {
			fields: [
				{
					name: 'Marketing Emails',
					fieldtype: 'checkbox',
					label: 'Receive marketing emails',
					checked_value: 'yes',
					unchecked_value: 'no'
				}
			]
		},
		context: {
			data: {
				marketing_emails: 'yes'
			}
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
					name: 'Privacy Policy',
					fieldtype: 'checkbox',
					label: 'I have read and accept the privacy policy',
					checked_value: true,
					unchecked_value: false,
					validations: [
						{
							expression: '[[jsonata]]data.privacy_policy = true',
							error_message: 'You must accept the privacy policy to continue'
						}
					],
					template_dependencies: ['data.privacy_policy']
				}
			]
		}
	}}
></Story>

<Story
	name="Boolean vs string validation"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'Account Type',
					fieldtype: 'checkbox',
					label: 'Business account (additional verification required)',
					checked_value: 'business',
					unchecked_value: 'personal',
					validations: [
						{
							expression: '[[jsonata]]data.account_type in ["business", "personal"]',
							error_message: 'Please select an account type'
						}
					],
					template_dependencies: ['data.account_type']
				},
				{
					name: 'Email Notifications',
					fieldtype: 'checkbox',
					label: 'Enable email notifications',
					checked_value: true,
					unchecked_value: false,
					validations: [
						{
							expression: '[[jsonata]]data.account_type = "business" ? data.email_notifications = true : true',
							error_message: 'Business accounts must enable email notifications'
						}
					],
					template_dependencies: ['data.account_type', 'data.email_notifications']
				}
			]
		}
	}}
></Story>

<Story
	name="Conditional checkbox"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'Has Company',
					fieldtype: 'checkbox',
					label: 'I have a company',
					checked_value: 'yes',
					unchecked_value: 'no'
				},
				{
					name: 'Tax Exempt',
					fieldtype: 'checkbox',
					label: 'Company is tax exempt',
					checked_value: 'exempt',
					unchecked_value: 'taxable',
					conditions: [
						{
							expression: '[[jsonata]]data.has_company = "yes"'
						}
					],
					template_dependencies: ['data.has_company']
				}
			]
		}
	}}
></Story>

<Story
	name="Feature toggles"
	args={{
		config: {
			fields: [
				{
					name: 'Dark Mode',
					fieldtype: 'checkbox',
					label: 'Enable dark mode',
					checked_value: 'dark',
					unchecked_value: 'light'
				},
				{
					name: 'Auto Save',
					fieldtype: 'checkbox',
					label: 'Auto-save documents',
					checked_value: 'enabled',
					unchecked_value: 'disabled'
				},
				{
					name: 'Beta Features',
					fieldtype: 'checkbox',
					label: 'Enable experimental features (may be unstable)',
					checked_value: 'beta',
					unchecked_value: 'stable'
				}
			]
		}
	}}
></Story>
