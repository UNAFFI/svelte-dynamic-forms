<script>
	// props
	let { content, ...rest } = $props();
</script>

<div class="html_component">
	{@html content}
</div>

<style>
	.html_component {
		padding: 16px;
		border-top: 1px solid #e0e0e0;
		border-bottom: 1px solid #e0e0e0;
		background: none;
	}
</style>
