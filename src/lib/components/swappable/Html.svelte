<script>
	// props
	let { content, ...rest } = $props();
</script>

<div class="html_component">
	{@html content}
</div>

<style>
	.html_component {
		padding: 16px 0px;
		background: none;
	}
</style>
