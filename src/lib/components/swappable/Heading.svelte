<script>
	// props
	let { content, ...rest } = $props();
</script>

<div class="heading_component">
	{content}
</div>

<style>
	.heading_component {
		font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
		font-size: 1.35rem;
		font-weight: 600;
		color: #222;
		letter-spacing: 0.01em;
		line-height: 1.3;
		margin: 24px 0 12px 0;
		padding: 0;
		border: none;
		background: none;
		box-sizing: border-box;
	}
	@media (max-width: 600px) {
		.heading_component {
			font-size: 1.08rem;
			margin: 16px 0 8px 0;
		}
	}
</style>
