<script>
	// props
	let { ...rest } = $props();
</script>

<div class="fieldset_component">
	{#each rest.definition.fields as field_definition, i (`${rest.definition.state_path}-${i}`)}
		<rest.field_component definition={field_definition} />
	{/each}
</div>

<style>
		.fieldset_component {
			display: flex;
			flex-direction: column;
			width: 100%;
			margin: 0 0 16px 0;
			box-sizing: border-box;
		}
		.fieldset_component > *:not(:last-child) {
			border-bottom: 1px solid #eee;
			margin-bottom: 12px;
			padding-bottom: 12px;
		}
		.fieldset_component > *:last-child {
			margin-bottom: 0;
			padding-bottom: 0;
			border-bottom: none;
		}
		@media (max-width: 600px) {
			.fieldset_component > *:not(:last-child) {
				margin-bottom: 8px;
				padding-bottom: 8px;
			}
			.fieldset_component {
				margin-bottom: 10px;
			}
		}
</style>