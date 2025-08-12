<script>
	// props
	let { next, previous, current_fields, current_page_index, state_root, ...rest } = $props();
</script>

<div class="pages_component">
	<div class="page_container">
		<rest.field_component
			definition={{
				...rest.definition,
				fieldtype: 'fieldset',
				fields: current_fields
			}}
		/>
	</div>
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