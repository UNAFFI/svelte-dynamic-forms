<script>
	// props
	let { next, previous, current_page_index, state_root, ...rest } = $props();
</script>

<div class="pages_component">
	{#each rest.definition.pages as page, page_index}
		<div class="page_container" class:hidden={page_index !== current_page_index}>
			<rest.field_component
				definition={{
					...rest.definition,
					name: `${rest.definition.name}_page_${page_index}`,
					fieldtype: 'fieldset',
					fields: page.fields
				}}
			/>
		</div>
	{/each}
	<div class="pagination_controls_container">
		<button
			type="button"
			class="page_button previous_button"
			onclick={() => previous()}
			disabled={current_page_index <= 0}
		>
			Previous
		</button>
		<button
			type="button"
			class="page_button next_button"
			onclick={() => next()}
			disabled={current_page_index >= rest.definition.pages.length - 1}
		>
			Next
		</button>
	</div>
</div>

<style>
	.pages_component {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		width: 100%;
		box-sizing: border-box;
		padding: 0;
		margin: 0 auto 0 0;
		max-width: 700px;
	}
	.page_container {
		background: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(60,60,60,0.06);
		padding: 28px 16px 18px 16px;
		margin-bottom: 18px;
		transition: box-shadow 0.2s cubic-bezier(0.4,0,0.2,1);
	}
	.page_container.hidden {
		display: none;
	}
	.pagination_controls_container {
		border-top: 1px solid #eee;
		padding-top: 16px;
		margin-top: 0;
		margin-bottom: 0;
		display: flex;
		justify-content: flex-end;
		gap: 12px;
	}
	.page_button {
		font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
		font-size: 1rem;
		font-weight: 500;
		color: #fff;
		background: #1976d2;
		border: none;
		border-radius: 4px;
		padding: 8px 20px;
		box-shadow: 0 1px 2px rgba(60,60,60,0.04);
		cursor: pointer;
		transition: background 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s cubic-bezier(0.4,0,0.2,1);
		outline: none;
		letter-spacing: 0.01em;
		min-width: 100px;
		margin: 0;
	}
	.page_button:hover:not(:disabled), .page_button:focus:not(:disabled) {
		background: #1565c0;
		box-shadow: 0 2px 8px rgba(25, 118, 210, 0.10);
	}
	.page_button:disabled {
		background: #e0e0e0;
		color: #bdbdbd;
		cursor: not-allowed;
		box-shadow: none;
	}
	@media (max-width: 600px) {
		.page_container {
			padding: 16px 4px 10px 4px;
			margin-bottom: 10px;
		}
		.pagination_controls_container {
			padding-top: 10px;
		}
	}
</style>