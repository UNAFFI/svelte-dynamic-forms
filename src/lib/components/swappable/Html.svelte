<script>
	// props
	let { content, ...rest } = $props();
</script>

<div class="html_component">
	{@html content}
</div>

<style>
	.html_component {
		padding: 16px 12px;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		box-sizing: border-box;
		background: none;
	}
</style>