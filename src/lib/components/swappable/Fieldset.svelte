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
		gap: 12px;
	}
</style>
