<script>
	// props
	let { children } = $props();
</script>

<div class="fieldcontainer_component">
	{@render children()}
</div>

<style>
		.fieldcontainer_component {
			margin-bottom: 12px;
			width: 100%;
			box-sizing: border-box;
		}
</style>
