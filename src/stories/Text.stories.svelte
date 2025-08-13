<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Inputs/Text',
		component: Form
	});
</script>

<Story
	name="Default"
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
	name="Label"
	args={{
		config: {
			fields: [
				{
					name: 'Full Name',
					fieldtype: 'text',
					label: 'Your name'
				}
			]
		}
	}}
/>

<Story
	name="Dynamic Label"
	args={{
		config: {
			fields: [
				{
					name: 'Full Name',
					fieldtype: 'text',
					placeholder: 'Please enter your full name',
				},
				{
					name: 'Age',
					fieldtype: 'text',
					dynamic_label: "'What is your age ' & dynamic.full_name & '?'",
					dynamic_context: { full_name: 'data.full_name' }	
				}
			]
		},
		context: {
			data: {
				full_name: "Freddie Mercury"
			}
		}
	}}
/>

<Story
	name="Placeholder"
	args={{
		config: {
			fields: [
				{
					name: 'Full Name',
					fieldtype: 'text',
					placeholder: 'Please enter your full name'
				}
			]
		}
	}}
/>

<Story
	name="Dynamic Placeholder"
	args={{
		config: {
			fields: [
				{
					name: 'Full Name',
					fieldtype: 'text',
					placeholder: 'Please enter your full name',
				},
				{
					name: 'Age',
					fieldtype: 'text',
					dynamic_placeholder: "'Please enter your age, ' & dynamic.full_name",
					dynamic_context: { full_name: 'data.full_name' }
				}
			]
		},
		context: {
			data: {
				full_name: "Freddie Mercury"
			}
		}
	}}
/>

<Story
	name="Hide Label"
	args={{
		config: {
			fields: [
				{
					name: 'Full Name',
					fieldtype: 'text',
					placeholder: 'Please enter your full name',
					hide_label: true
				}
			]
		}
	}}
/>
