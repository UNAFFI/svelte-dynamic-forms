<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Field/Properties',
		component: Form
	});
</script>

<Story
	name="Name and Fieldtype"
	args={{
		config: {
			fields: [
				{
					name: 'Full Name',
					fieldtype: 'text'
				}
			]
		}
	}}
/>

<Story
	name="Data Path"
	args={{
		config: {
			fields: [
				{
					name: 'Full Name',
					fieldtype: 'text',
					data_path: 'name'
				}
			]
		}
	}}
/>

<Story
	name="Same Data Path"
	args={{
		config: {
			fields: [
				{
					name: 'Full Name',
					fieldtype: 'text',
					data_path: 'name'
				},
				{
					name: 'Full Name But Different',
					fieldtype: 'text',
					data_path: 'name'
				}
			]
		}
	}}
/>

<Story
	name="Validations"
	args={{
		config: {
			fields: [
				{
					name: 'Full Name',
					fieldtype: 'text',
					dynamic_context: { name: 'data.full_name' },
					validations: [
						{
							expression: '$length($trim(dynamic.name)) > 0',
							error_message: 'Full Name is required.'
						},
						{
							expression: '$length($trim(dynamic.name)) < 20',
							error_message: 'Full Name must be less than 20 characters.'
						}
					]
				},
				{
					name: "Won't trigger evaluation",
					fieldtype: 'text'
				}
			]
		},
		context: {
			show_validation: true
		}
	}}
/>

<Story
	name="Conditions"
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
					dynamic_context: { name: 'data.full_name' },
					conditions: [
						{
							expression: '$length($trim(dynamic.name)) > 0'
						}
					]
				}
			]
		},
		context: {
			data: {
				age: 46
			}
		}
	}}
/>

<Story
	name="Conditions With Keep Data"
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
					dynamic_context: { name: 'data.full_name' },
					conditions: [
						{
							expression: '$length($trim(dynamic.name)) > 0'
						}
					],
					keep_data_on_conditions_failed: true
				}
			]
		},
		context: {
			data: {
				age: 46
			}
		}
	}}
/>

<Story
	name="Default Value"
	args={{
		config: {
			fields: [
				{
					name: 'Full Name',
					fieldtype: 'text',
					default: 'profile.preferred_name'
				}
			]
		},
		context: { profile: { preferred_name: 'John Doe' } }
	}}
/>

<Story
	name="Existing Value"
	args={{
		config: {
			fields: [
				{
					name: 'Full Name',
					fieldtype: 'text'
				}
			]
		},
		context: { data: { full_name: 'Frikkie' } }
	}}
/>

<Story
	name="Break Things"
	args={{
		config: {
			fields: [
				{
					name: 'Level 1',
					fieldtype: 'array',
					array_item_config: {
						fields: [
							{
								name: 'Level 2',
								fieldtype: 'array',
								array_item_config: {
									fields: [
										{
											name: 'Level 3',
											fieldtype: 'fieldset',
											fields: [
												{
													name: 'Full name',
													fieldtype: 'text'
												},
												{
													name: 'Age',
													fieldtype: 'text'
												}
											]
										}
									]
								}
							}
						]
					}
				}
			]
		},
		context: {
			data: {
				level_1: [
					{
						level_2: [
							{
								level_3: {
									full_name: 'Frikkie',
									age: 46
								}
							},
							{
								level_3: {
									full_name: 'John',
									age: 15
								}
							},
							{
								level_3: {
									full_name: 'Andrew',
									age: 28
								}
							}
						]
					},
					{
						level_2: [
							{
								level_3: {
									full_name: 'Frikkie',
									age: 46
								}
							},
							{
								level_3: {
									full_name: 'John',
									age: 15
								}
							},
							{
								level_3: {
									full_name: 'Frikkie',
									age: 46
								}
							},
							{
								level_3: {
									full_name: 'John',
									age: 15
								}
							},
							{
								level_3: {
									full_name: 'Andrew',
									age: 28
								}
							}
						]
					}
				]
			}
		}
	}}
/>
