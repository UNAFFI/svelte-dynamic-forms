<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';
	import CustomComponent from './CustomComponent.svelte';

	const { Story } = defineMeta({
		component: Form,
		title: 'General/Field Properties',
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

<!-- Determines the component to render -->
<Story
	name="fieldtype"
	args={{
		config: {
			fields: [
				{
					fieldtype: 'text'
				}
			]
		}
	}}
></Story>

<!-- Used primarily to determine where the field will write data but it has UI implications as well (e.g. label and placeholder)-->
<Story
	name="name"
	args={{
		config: {
			fields: [
				{
					name: 'You can name your field whatever you want',
					fieldtype: 'text'
				}
			]
		}
	}}
></Story>

<!-- Determines where in 'context.data' the field's value should be written (default is snake case of 'name') -->
<Story
	name="data_path"
	args={{
		config: {
			fields: [
				{
					name: 'Full name',
					fieldtype: 'text',
					data_path: 'profile.details.descname'
				}
			]
		}
	}}
></Story>

<!-- Will be set in the field's 'data_path' if no value is defined yet (evaluated as template on field mount) -->
<Story
	name="default"
	args={{
		config: {
			fields: [
				{
					name: 'Full name',
					fieldtype: 'text',
					default: '{{profile.details.descname}}'
				}
			]
		},
		context: {
			profile: {
				details: {
					descname: 'John Doe'
				}
			}
		}
	}}
></Story>

<!-- Used in certain fieldtypes like text (evaluated whenever the template_dependencies change) -->
<Story
	name="label"
	args={{
		config: {
			fields: [
				{
					name: 'Age',
					fieldtype: 'text',
					label: 'What is your age?'
				}
			]
		}
	}}
></Story>

<!-- Set to true if you want to hide the field label -->
<Story
	name="hide_label"
	args={{
		config: {
			fields: [
				{
					name: 'Age',
					fieldtype: 'text',
					hide_label: true
				}
			]
		}
	}}
></Story>

<!-- Used in certain fieldtypes like text (evaluated whenever the template_dependencies change) -->
<Story
	name="placeholder"
	args={{
		config: {
			fields: [
				{
					name: 'Age',
					fieldtype: 'text',
					label: 'What is your age?',
					placeholder: 'Please enter your age in years'
				}
			]
		}
	}}
></Story>

<!-- Used in certain fieldtypes like heading (evaluated whenever the template_dependencies change) -->
<Story
	name="content"
	args={{
		config: {
			fields: [
				{
					name: 'Heading',
					fieldtype: 'heading',
					content: 'Hello world'
				}
			]
		}
	}}
></Story>

<!-- Triggers re-evaluation of various template expressions for the field -->
<Story
	name="template_dependencies"
	args={{
		config: {
			fields: [
				{
					name: 'heading',
					fieldtype: 'heading',
					template_dependencies: ['data.full_name'],
					content: 'Hi there{{#data.full_name}}, {{/data.full_name}}{{data.full_name}}!'
				},
				{
					name: 'Full name',
					fieldtype: 'text',
					placeholder: 'Typing here will update the heading'
				},
				{
					name: 'Age',
					fieldtype: 'text',
					placeholder: 'Typing here triggers nothing'
				}
			]
		}
	}}
></Story>

<!-- Gets re-evaluated first and can then be used in subsequent evaluations -->
<Story
	name="template_context"
	args={{
		config: {
			fields: [
				{
					name: 'heading',
					fieldtype: 'heading',
					template_dependencies: ['data.names', 'data.surname'],
					template_context: {
						full_name: "[[jsonata]]$trim(data.names & ' ' & data.surname)"
					},
					content:
						'Hi there{{#field_state.template_context.full_name}}, {{/field_state.template_context.full_name}}{{field_state.template_context.full_name}}!'
				},
				{
					name: 'Names',
					fieldtype: 'text'
				},
				{
					name: 'Surname',
					fieldtype: 'text'
				}
			]
		}
	}}
></Story>

<!-- Every condition must be met for the field to render (evaluated whenever the template_dependencies change) -->
<Story
	name="conditions"
	args={{
		config: {
			fields: [
				{
					name: 'Full Name',
					fieldtype: 'text'
				},
				{
					name: 'Age',
					fieldtype: 'text',
					placeholder: 'You can only set your age if you have a name',
					template_dependencies: ['data.full_name'],
					conditions: [
						{
							expression: '{{data.full_name}}'
						}
					]
				}
			]
		},
		context: {
			data: {
				full_name: 'John Doe'
			}
		}
	}}
></Story>

<!-- Set to true if you want the data written in conditional fields to persist even if the conditions fail -->
<Story
	name="keep_data_on_conditions_failed"
	args={{
		config: {
			fields: [
				{
					name: 'Full Name',
					fieldtype: 'text'
				},
				{
					name: 'Age',
					fieldtype: 'text',
					placeholder: 'Set this and remove your name if you really want to',
					template_dependencies: ['data.full_name'],
					conditions: [
						{
							expression: '{{data.full_name}}'
						}
					],
					keep_data_on_conditions_failed: true
				}
			]
		},
		context: {
			data: {
				full_name: 'John Doe'
			}
		}
	}}
></Story>

<!-- Every validation must be met for the field to be valid (evaluated whenever the template_dependencies change) -->
<Story
	name="validations"
	args={{
		config: {
			show_validation: true,
			fields: [
				{
					name: 'Full Name',
					fieldtype: 'text',
					template_dependencies: ['data.full_name'],
					validations: [
						{
							expression: '{{data.full_name}}',
							error_message: 'Full Name is required'
						}
					]
				}
			]
		}
	}}
></Story>

<!-- Used in certain fieldtypes like fieldset -->
<Story
	name="fields"
	args={{
		config: {
			fields: [
				{
					name: 'Details',
					fieldtype: 'fieldset',
					fields: [
						{
							fieldtype: 'text',
							name: 'Full Name'
						},
						{
							fieldtype: 'text',
							name: 'Age'
						}
					]
				}
			]
		}
	}}
></Story>

<!-- Config for every item in array. Used in certain fieldtypes like array -->
<Story
	name="array_item_config"
	args={{
		config: {
			fields: [
				{
					name: 'Items',
					fieldtype: 'array',
					array_item_config: {
						fields: [
							{
								fieldtype: 'text',
								name: 'Item Name'
							},
							{
								fieldtype: 'text',
								name: 'Item Quantity'
							}
						]
					}
				}
			]
		},
		context: {
			data: {
				items: [
					{
						item_name: 'Pillows',
						item_quantity: 2
					},
					{
						item_name: 'Blankets',
						item_quantity: 1
					},
					{
						item_name: 'Towels',
						item_quantity: 3
					}
				]
			}
		}
	}}
></Story>

<!-- Config for every page in pages. Used in certain fieldtypes like pages -->
<Story
	name="pages"
	args={{
		config: {
			fields: [
				{
					name: 'Profile',
					fieldtype: 'pages',
					pages: [
						{
							fields: [
								{
									fieldtype: 'heading',
									content: 'Basic Details'
								},
								{
									fieldtype: 'text',
									name: 'Full Name'
								},
								{
									fieldtype: 'text',
									name: 'Age'
								}
							]
						},
						{
							fields: [
								{
									fieldtype: 'heading',
									content: 'Additional Details'
								},
								{
									fieldtype: 'text',
									name: 'Address'
								},
								{
									fieldtype: 'text',
									name: 'Phone Number'
								}
							]
						}
					]
				}
			]
		}
	}}
></Story>

<!-- The key for the custom component (passed via swappable components) to render. Used in certain fieldtypes like custom -->
<Story
	name="custom_component_key"
	args={{
		config: {
			fields: [
				{
					fieldtype: 'custom',
					custom_component_key: '_CustomComponent'
				}
			]
		},
		swappable_components: {
			_CustomComponent: CustomComponent
		}
	}}
></Story>

<!-- The options for the field. Used in certain fieldtypes like select (evaluated whenever the template_dependencies change) -->
<Story
	name="options"
	args={{
		config: {
			fields: [
				{
					name: 'Favorite Color',
					fieldtype: 'select',
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
		},
		context: {
			data: {
				favorite_color: 'blue'
			}
		}
	}}
></Story>

<!-- The value to store when the checkbox is checked. Used in the checkbox fieldtype (default is true) -->
<Story
	name="checked_value"
	args={{
		config: {
			fields: [
				{
					name: 'Marketing Emails',
					fieldtype: 'checkbox',
					checked_value: 'yes'
				}
			]
		}
	}}
></Story>

<!-- The value to store when the checkbox is unchecked. Used in the checkbox fieldtype (default is false) -->
<Story
	name="unchecked_value"
	args={{
		config: {
			fields: [
				{
					name: 'Newsletter Subscription',
					fieldtype: 'checkbox',
					checked_value: 'subscribed',
					unchecked_value: 'unsubscribed'
				}
			]
		}
	}}
></Story>
