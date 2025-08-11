<script>
	// props
	let { next, previous, current_fields, current_page_index, state_root, ...rest } = $props();
</script>

<rest.field_component
	definition={{
		...rest.definition,
		fieldtype: 'fieldset',
		fields: current_fields
	}}
/>
<div class="pagination_controls">
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

<style>
	/* Container to center the buttons */
	.pagination_controls {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 12px; /* space between buttons */
		margin-top: 16px;
	}

	/* Base page button style */
	.page_button {
		padding: 6px 16px;
		font-size: 0.875rem; /* 14px */
		font-weight: 500;
		border-radius: 4px;
		border: none;
		cursor: pointer;
		font-family: Roboto, Arial, sans-serif;
		transition:
			background-color 0.2s ease,
			box-shadow 0.2s ease,
			opacity 0.2s ease;
		color: white;
	}

	/* Disabled state */
	.page_button:disabled {
		background-color: rgba(0, 0, 0, 0.12);
		color: rgba(0, 0, 0, 0.38);
		cursor: default;
		box-shadow: none;
	}

	/* Next button — Material Primary Blue */
	.next_button {
		background-color: #1976d2;
	}

	.next_button:hover:not(:disabled) {
		background-color: #115293;
	}

	/* Previous button — Neutral Gray */
	.previous_button {
		background-color: #9e9e9e;
	}

	.previous_button:hover:not(:disabled) {
		background-color: #7e7e7e;
	}
</style>
