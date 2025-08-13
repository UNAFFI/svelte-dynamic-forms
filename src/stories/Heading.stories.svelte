<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Inputs/Heading',
		component: Form
	});
</script>

<Story
	name="Default"
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
/>

<Story
	name="Dynamic"
	args={{
		config: {
			fields: [
				{
					name: 'Full name',
					fieldtype: 'text'
				},
				{
					name: 'Heading',
					fieldtype: 'heading',
					content: "Hello {{data.full_name}}",
					template_dependencies: ["data.full_name"]
				}
			]
		},
		context: {
			data: {
				full_name: 'John Doe'
			}
		}
	}}
/>
