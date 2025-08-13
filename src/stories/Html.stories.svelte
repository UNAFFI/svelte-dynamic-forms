<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Inputs/Html',
		component: Form
	});
</script>

<Story
	name="Default"
	args={{
		config: {
			fields: [
				{
					name: 'Html',
					fieldtype: 'html',
					content: '<b>Hello</b> <i>world</i>'
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
					name: 'Html',
					fieldtype: 'html',
					dynamic_content: "'<b>Hello</b> <i>' & dynamic.full_name & '</i>'",
					dynamic_context: {
						full_name: "data.full_name"
					}
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
