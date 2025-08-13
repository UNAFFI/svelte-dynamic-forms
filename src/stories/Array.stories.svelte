<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Inputs/Array',
		component: Form
	});
</script>

<Story
	name="Default"
	args={{
		config: {
			fields: [
				{
					name: 'People',
					fieldtype: 'array',
					array_item_config: {
						fields: [
							{
								fieldtype: 'text',
								name: 'Full Name'
							},
							{
								fieldtype: 'text',
								name: 'Email'
							},
							{
								fieldtype: 'text',
								name: 'Phone Number'
							}
						]
					}
				}
			]
		},
		context: {
			data: {
				people: [
					{
						full_name: 'Ivan'
					},
					{
						full_name: 'Tertius'
					},
					{
						full_name: 'Dean'
					}
				]
			}
		}
	}}
/>
