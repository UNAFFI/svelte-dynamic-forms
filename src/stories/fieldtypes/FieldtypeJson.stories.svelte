<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	const { Story } = defineMeta({
		component: Form,
		title: 'Field Types/Json',
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

<!-- Basic JSON editor field -->
<Story
	name="Basic Example"
	args={{
		config: {
			fields: [
				{
					name: 'Configuration Data',
					fieldtype: 'json',
					label: 'Edit JSON configuration'
				}
			]
		}
	}}
></Story>

<!-- JSON field with default value -->
<Story
	name="With Default Value"
	args={{
		config: {
			fields: [
				{
					name: 'API Settings',
					fieldtype: 'json',
					label: 'API Configuration',
					default: {
						endpoint: "https://api.example.com",
						timeout: 5000,
						retries: 3
					}
				}
			]
		}
	}}
></Story>

<!-- JSON field with validation -->
<Story
	name="With Validation"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'Database Config',
					fieldtype: 'json',
					label: 'Database configuration (host and port required)',
					validations: [
						{
							expression: '[[jsonata]]$exists(data.database_config)',
							error_message: 'Database configuration is required'
						},
						{
							expression: '[[jsonata]]$length($trim(data.database_config.host)) > 0',
							error_message: 'Database host must be specified'
						},
						{
							expression: '[[jsonata]]$exists(data.database_config.port)',
							error_message: 'Database port must be specified'
						},
						{
							expression: '[[jsonata]]$number(data.database_config.port) > 0 and $number(data.database_config.port) <= 65535',
							error_message: 'Port must be between 1 and 65535'
						}
					],
					template_dependencies: ['data.database_config'],
					default: {
						host: "",
						port: ""
					}
				}
			]
		}
	}}
></Story>

<!-- JSON field with conditional display -->
<Story
	name="Conditional JSON Editor"
	args={{
		config: {
			fields: [
				{
					name: 'Enable Advanced Mode',
					fieldtype: 'checkbox',
					checked_value: true,
					unchecked_value: false
				},
				{
					name: 'Advanced Settings',
					fieldtype: 'json',
					label: 'Advanced configuration (JSON)',
					conditions: [
						{
							expression: '[[jsonata]]data.enable_advanced_mode = true'
						}
					],
					default: {
						debug: false,
						logLevel: "info",
						features: {
							experimental: false
						}
					},
					template_dependencies: ['data.enable_advanced_mode']
				}
			]
		}
	}}
></Story>

<!-- Complex JSON validation example -->
<Story
	name="Complex Validation"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'User Preferences',
					fieldtype: 'json',
					label: 'User preferences (theme and language required)',
					default: {
						theme: "light",
						notifications: {
							email: true,
							push: false
						},
						language: "en"
					},
					validations: [
						{
							expression: '[[jsonata]]$exists(data.user_preferences.theme)',
							error_message: 'Theme preference is required'
						},
						{
							expression: '[[jsonata]]data.user_preferences.theme in ["light", "dark", "auto"]',
							error_message: 'Theme must be light, dark, or auto'
						},
						{
							expression: '[[jsonata]]$exists(data.user_preferences.language)',
							error_message: 'Language preference is required'
						},
						{
							expression: '[[jsonata]]$type(data.user_preferences.notifications) = "object"',
							error_message: 'Notifications must be an object'
						}
					],
					template_dependencies: ['data.user_preferences']
				}
			]
		}
	}}
></Story>

<!-- JSON field for API request building -->
<Story
	name="API Request Builder"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'HTTP Method',
					fieldtype: 'select',
					options: [
						{ label: 'GET', value: 'GET' },
						{ label: 'POST', value: 'POST' },
						{ label: 'PUT', value: 'PUT' },
						{ label: 'DELETE', value: 'DELETE' }
					]
				},
				{
					name: 'Request Headers',
					fieldtype: 'json',
					label: 'HTTP Headers (JSON object)',
					default: {
						"Content-Type": "application/json",
						"Accept": "application/json"
					}
				},
				{
					name: 'Request Body',
					fieldtype: 'json',
					label: 'Request body (required for POST/PUT)',
					conditions: [
						{
							expression: '[[jsonata]]data.http_method in ["POST", "PUT"]'
						}
					],
					validations: [
						{
							expression: '[[jsonata]]data.http_method in ["POST", "PUT"] ? $exists(data.request_body) : true',
							error_message: 'Request body is required for POST and PUT requests'
						}
					],
					template_dependencies: ['data.http_method', 'data.request_body']
				}
			]
		},
		context: {
			data: {
				http_method: 'POST'
			}
		}
	}}
></Story>
