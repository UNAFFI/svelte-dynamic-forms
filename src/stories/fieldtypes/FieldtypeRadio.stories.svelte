<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	const { Story } = defineMeta({
		component: Form,
		title: 'Field Types/Radio',
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
					name: 'Favorite Color',
					fieldtype: 'radio',
					options: [
						{
							label: 'Yellow',
							value: 'yellow'
						},
						{
							label: 'Green',
							value: 'green'
						},
						{
							label: 'Blue',
							value: 'blue'
						},
						{
							label: 'Red',
							value: 'red'
						}
					]
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
					name: 'Priority Level',
					fieldtype: 'radio',
					label: 'What is the priority level?',
					options: [
						{
							label: 'Low',
							value: 'low'
						},
						{
							label: 'Medium',
							value: 'medium'
						},
						{
							label: 'High',
							value: 'high'
						},
						{
							label: 'Critical',
							value: 'critical'
						}
					]
				}
			]
		}
	}}
></Story>

<Story
	name="With hidden label"
	args={{
		config: {
			fields: [
				{
					name: 'Size',
					fieldtype: 'radio',
					label: 'Choose your size',
					hide_label: true,
					options: [
						{
							label: 'Small',
							value: 'S'
						},
						{
							label: 'Medium',
							value: 'M'
						},
						{
							label: 'Large',
							value: 'L'
						},
						{
							label: 'Extra Large',
							value: 'XL'
						}
					]
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
					name: 'Agreement',
					fieldtype: 'radio',
					options: [
						{
							label: 'I agree',
							value: 'agree'
						},
						{
							label: 'I disagree',
							value: 'disagree'
						}
					],
					validations: [{ expression: '[[jsonata]]false', error_message: 'This will always be invalid' }]
				}
			]
		}
	}}
></Story>

<Story
	name="Dynamic options"
	args={{
		config: {
			fields: [
				{
					name: 'Favorite Color',
					fieldtype: 'radio',
					options: '[[jsonata]]data.color_options',
					template_dependencies: ['data.color_options']
				},
				{
					name: 'Color options',
					fieldtype: 'array',
					array_item_config: {
						fields: [
							{
								name: 'Label',
								fieldtype: 'text'
							}
						]
					}
				}
			]
		},
		context: {
			data: {
				color_options: [
					{
						label: "Yellow"
					},
					{
						label: "Green"
					},
					{
						label: "Blue"
					},
					{
						label: "Red"
					}
				],
				favorite_color: "Green"
			}
		}
	}}
></Story>
