<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	const { Story } = defineMeta({
		component: Form,
		title: 'Field Types/Number',
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
					name: 'Age',
					fieldtype: 'number'
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
					name: 'Age',
					fieldtype: 'number',
					label: 'How old are you?'
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
					name: 'Price',
					fieldtype: 'number',
					label: 'Product price',
					placeholder: 'Enter price in USD'
				}
			]
		}
	}}
></Story>

<Story
	name="With pre-filled value"
	args={{
		config: {
			fields: [
				{
					name: 'Quantity',
					fieldtype: 'number',
					label: 'Quantity'
				}
			]
		},
		context: {
			data: {
				quantity: 10
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
					name: 'Age',
					fieldtype: 'number',
					label: 'How old are you?',
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
					name: 'Age',
					fieldtype: 'number',
					label: 'Age (must be 18 or older)',
					validations: [
						{
							expression: '[[jsonata]]$exists(data.age)',
							error_message: 'Please enter your age'
						},
						{
							expression: '[[jsonata]]$number(data.age) >= 18',
							error_message: 'You must be at least 18 years old'
						},
						{
							expression: '[[jsonata]]$number(data.age) <= 120',
							error_message: 'Please enter a valid age'
						}
					],
					template_dependencies: ['data.age']
				}
			]
		}
	}}
></Story>

<Story
	name="Price range validation"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'Product Price',
					fieldtype: 'number',
					label: 'Product price ($1 - $10,000)',
					placeholder: 'Enter price',
					validations: [
						{
							expression: '[[jsonata]]$exists(data.product_price)',
							error_message: 'Please enter a price'
						},
						{
							expression: '[[jsonata]]$number(data.product_price) > 0',
							error_message: 'Price must be greater than $0'
						},
						{
							expression: '[[jsonata]]$number(data.product_price) >= 1',
							error_message: 'Minimum price is $1.00'
						},
						{
							expression: '[[jsonata]]$number(data.product_price) <= 10000',
							error_message: 'Maximum price is $10,000'
						}
					],
					template_dependencies: ['data.product_price']
				}
			]
		}
	}}
></Story>

<Story
	name="Decimal precision validation"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'Rating',
					fieldtype: 'number',
					label: 'Product rating (0.0 - 5.0)',
					placeholder: 'Enter rating (e.g., 4.5)',
					validations: [
						{
							expression: '[[jsonata]]$exists(data.rating)',
							error_message: 'Please enter a rating'
						},
						{
							expression: '[[jsonata]]$number(data.rating) >= 0',
							error_message: 'Rating must be 0 or higher'
						},
						{
							expression: '[[jsonata]]$number(data.rating) <= 5',
							error_message: 'Rating cannot exceed 5.0'
						},
						{
							expression: '[[jsonata]]$string($number(data.rating)) ~> /^\\d+(\\.\\d{1,2})?$/',
							error_message: 'Rating can have at most 2 decimal places'
						}
					],
					template_dependencies: ['data.rating']
				}
			]
		}
	}}
></Story>

<Story
	name="Budget calculator"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'Monthly Income',
					fieldtype: 'number',
					label: 'Monthly income',
					placeholder: 'Enter monthly income'
				},
				{
					name: 'Monthly Expenses',
					fieldtype: 'number',
					label: 'Monthly expenses',
					placeholder: 'Enter monthly expenses',
					validations: [
						{
							expression: '[[jsonata]]$exists(data.monthly_income) ? $number(data.monthly_expenses) <= $number(data.monthly_income) : true',
							error_message: 'Expenses cannot exceed income'
						}
					],
					template_dependencies: ['data.monthly_income', 'data.monthly_expenses']
				},
				{
					name: 'Savings Goal',
					fieldtype: 'number',
					label: 'Monthly savings goal',
					placeholder: 'Enter savings goal',
					validations: [
						{
							expression: '[[jsonata]]($exists(data.monthly_income) and $exists(data.monthly_expenses)) ? $number(data.savings_goal) <= ($number(data.monthly_income) - $number(data.monthly_expenses)) : true',
							error_message: 'Savings goal cannot exceed available income after expenses'
						}
					],
					template_dependencies: ['data.monthly_income', 'data.monthly_expenses', 'data.savings_goal']
				}
			]
		}
	}}
></Story>
