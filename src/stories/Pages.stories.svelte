<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Inputs/Pages',
		component: Form
	});
</script>

<Story
	name="Default"
	args={{
		config: {
			fields: [
				{
					name: 'Details',
					fieldtype: 'pages',
					pages: [
						{
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
						},
						{
							fields: [
								{
									fieldtype: 'text',
									name: 'Address'
								}
							]
						}
					]
				}
			]
		}
	}}
/>
