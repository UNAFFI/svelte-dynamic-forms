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
	name="Registration Form with Conditional Logic"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'Account Type',
					fieldtype: 'select',
					placeholder: 'Choose account type',
					options: [
						{ label: 'Personal Account', value: 'personal' },
						{ label: 'Business Account', value: 'business' }
					],
					validations: [
						{
							expression: '[[jsonata]]$exists(data.account_type)',
							error_message: 'Please select an account type'
						}
					],
					template_dependencies: ['data.account_type']
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

<Story
	name="Advanced Select Field Examples"
	args={{
		config: {
			fields: [
				{
					name: 'Product Category',
					fieldtype: 'select',
					placeholder: 'Choose a category',
					options: [
						{ label: 'Electronics', value: 'electronics' },
						{ label: 'Clothing', value: 'clothing' },
						{ label: 'Home & Garden', value: 'home_garden' },
						{ label: 'Books', value: 'books' }
					],
					validations: [
						{
							expression: '[[jsonata]]$exists(data.product_category)',
							error_message: 'Product category is required'
						}
					],
					template_dependencies: ['data.product_category']
				},
				{
					name: 'Subcategory',
					fieldtype: 'select',
					placeholder: 'Choose a subcategory',
					// Dynamic options based on selected category
					options:
						'[[jsonata]]data.product_category = "electronics" ? [{"label": "Laptops", "value": "laptops"}, {"label": "Smartphones", "value": "smartphones"}, {"label": "Tablets", "value": "tablets"}] : data.product_category = "clothing" ? [{"label": "Men\'s Clothing", "value": "mens"}, {"label": "Women\'s Clothing", "value": "womens"}, {"label": "Kids\' Clothing", "value": "kids"}] : data.product_category = "home_garden" ? [{"label": "Furniture", "value": "furniture"}, {"label": "Decor", "value": "decor"}, {"label": "Tools", "value": "tools"}] : []',
					conditions: [
						{
							expression: '[[jsonata]]$exists(data.product_category)'
						}
					],
					template_dependencies: ['data.product_category'],
					validations: [
						{
							expression: '[[jsonata]]$exists(data.subcategory)',
							error_message: 'Please select a subcategory'
						}
					]
				},
				{
					name: 'Product Summary',
					fieldtype: 'html',
					content:
						'<p>Selected: <strong>{{data.product_category_label}} > {{data.subcategory_label}}</strong></p>',
					conditions: [
						{
							expression: '[[jsonata]]$exists(data.product_category) and $exists(data.subcategory)'
						}
					],
					template_dependencies: ['data.product_category_label', 'data.subcategory_label']
				},
				{
					name: 'Priority',
					fieldtype: 'select',
					placeholder: 'Select priority',
					options: [
						{ label: '🔴 High Priority', value: 'high' },
						{ label: '🟡 Medium Priority', value: 'medium' },
						{ label: '🟢 Low Priority', value: 'low' }
					],
					default: 'medium', // Default selection
					validations: [
						{
							expression: '[[jsonata]]data.priority in ["high", "medium", "low"]',
							error_message: 'Please select a valid priority level'
						}
					],
					template_dependencies: ['data.priority']
				}
			]
		}
	}}
></Story>
