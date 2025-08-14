<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	const { Story } = defineMeta({
		component: Form,
		title: 'Field Types/Checkboxes',
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
					name: 'Favorite Colors',
					fieldtype: 'checkboxes',
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
						},
						{
							label: 'Purple',
							value: 'purple'
						},
						{
							label: 'Orange',
							value: 'orange'
						}
					]
				}
			]
		}
	}}
></Story>

<Story
	name="Pre-selected values"
	args={{
		config: {
			fields: [
				{
					name: 'Programming Languages',
					fieldtype: 'checkboxes',
					options: [
						{
							label: 'JavaScript',
							value: 'javascript'
						},
						{
							label: 'Python',
							value: 'python'
						},
						{
							label: 'Java',
							value: 'java'
						},
						{
							label: 'C++',
							value: 'cpp'
						},
						{
							label: 'Go',
							value: 'go'
						},
						{
							label: 'Rust',
							value: 'rust'
						}
					]
				}
			]
		},
		context: {
			data: {
				programming_languages: [
					{ label: 'JavaScript', value: 'javascript' },
					{ label: 'Python', value: 'python' }
				]
			}
		}
	}}
></Story>

<Story
	name="Dynamic options"
	args={{
		config: {
			fields: [
				{
					name: 'Selected Skills',
					fieldtype: 'checkboxes',
					options: '[[jsonata]]data.skill_options',
					template_dependencies: ['data.skill_options']
				},
				{
					name: 'Skill options',
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
				skill_options: [
					{
						label: "Frontend Development"
					},
					{
						label: "Backend Development"
					},
					{
						label: "Database Design"
					},
					{
						label: "DevOps"
					},
					{
						label: "Mobile Development"
					}
				],
				selected_skills: [
					{ label: "Frontend Development", value: "Frontend Development" },
					{ label: "DevOps", value: "DevOps" }
				]
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
					name: 'Required Skills',
					fieldtype: 'checkboxes',
					options: [
						{
							label: 'Communication',
							value: 'communication'
						},
						{
							label: 'Problem Solving',
							value: 'problem_solving'
						},
						{
							label: 'Teamwork',
							value: 'teamwork'
						},
						{
							label: 'Leadership',
							value: 'leadership'
						},
						{
							label: 'Time Management',
							value: 'time_management'
						}
					],
					validations: [
						{
							expression: '[[jsonata]]$count(data.required_skills) >= 2',
							error_message: 'Please select at least 2 skills'
						},
						{
							expression: '[[jsonata]]$count(data.required_skills) <= 4',
							error_message: 'Please select no more than 4 skills'
						}
					],
					template_dependencies: ['data.required_skills']
				}
			]
		}
	}}
></Story>
