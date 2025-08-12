<script>
	// props
	let { add, remove, moveUp, moveDown, ...rest } = $props();
</script>

<div class="array_component">
	{#each rest.data_root[rest.definition.data_key] as _, i (`${rest.definition.data_path}_${i}`)}
		<div class="item_container">
			<div class="item_form_container">
				{#key rest.data_root[rest.definition.data_key]}
					<rest.field_component
						definition={{
							name: i.toString(),
							fieldtype: 'fieldset',
							fields: rest.definition.item_config?.fields,
							parent_data_path: rest.definition.data_path,
							parent_state_path: rest.definition.state_path
						}}
					/>
				{/key}
			</div>
			<div class="item_controls_container">
				<button type="button" class="remove_button" onclick={() => remove(i)}>Remove</button>
				<button type="button" class="move_button move_up_button" onclick={() => moveUp(i)}>
					Move Up
				</button>
				<button type="button" class="move_button move_down_button" onclick={() => moveDown(i)}>
					Move Down
				</button>
			</div>
		</div>
	{/each}
	<button type="button" class="add_button" onclick={() => add()}>Add Item</button>
</div>
