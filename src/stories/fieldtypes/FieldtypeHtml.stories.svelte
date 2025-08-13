<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Form from '$lib/components/Form.svelte';

	const { Story } = defineMeta({
		component: Form,
		title: 'Field Types/Html',
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
					fieldtype: 'html',
                    // rick-roll image gif
                    content: '<img src="https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyZ25sb2tqb3k5MG8wNGxmdWo0b3QwM2s3enN5cW9rYTZjNDh6azNtMSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/a6OnFHzHgCU1O/source.gif" alt="Rick Roll" />'
				}
			]
		}
	}}
></Story>
