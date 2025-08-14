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
							fields: rest.definition.array_item_config?.fields,
							parent_data_path: rest.definition.data_path,
							parent_state_path: rest.definition.state_path
						}}
					/>
				{/key}
			</div>
			<div class="item_controls_container">
				<button type="button" class="remove_button" onclick={() => remove(i)}>Remove</button>
				<button
					type="button"
					class="move_button move_up_button"
					disabled={i === 0}
					onclick={() => moveUp(i)}
				>
					Move Up
				</button>
				<button
					type="button"
					class="move_button move_down_button"
					disabled={i === rest.data_root[rest.definition.data_key].length - 1}
					onclick={() => moveDown(i)}
				>
					Move Down
				</button>
			</div>
		</div>
	{/each}
	<button type="button" class="add_button" onclick={() => add()}>Add Item</button>
</div>

<style>
	.array_component {
		display: flex;
		flex-direction: column;
		gap: 20px;
		width: 100%;
		margin: 0 auto 0 0;
		box-sizing: border-box;
		max-width: 700px;
	}
	.item_container {
		display: flex;
		align-items: flex-start;
		gap: 16px;
		background: #fcfcfd;
		border-radius: 6px;
		box-shadow: 0 1px 2px rgba(60, 60, 60, 0.025);
		padding: 16px 10px 12px 10px;
		position: relative;
		transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.item_form_container {
		flex: 1 1 auto;
		min-width: 0;
	}
	.item_controls_container {
		display: flex;
		flex-direction: column;
		gap: 8px;
		align-items: flex-end;
		min-width: 110px;
	}
	.add_button,
	.remove_button,
	.move_button {
		font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.8rem;
		font-weight: 500;
		border: none;
		border-radius: 4px;
		padding: 5px 0;
		margin: 0;
		cursor: pointer;
		outline: none;
		transition:
			background 0.2s cubic-bezier(0.4, 0, 0.2, 1),
			color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 1px 2px rgba(60, 60, 60, 0.04);
		letter-spacing: 0.01em;
		width: 96px;
		min-width: 96px;
		max-width: 96px;
		text-align: center;
	}
	.add_button {
		background: #1976d2;
		color: #fff;
		align-self: flex-start;
		margin-top: 8px;
	}
	.add_button:hover,
	.add_button:focus {
		background: #1565c0;
	}
	.remove_button {
		background: #d32f2f;
		color: #fff;
	}
	.remove_button:hover,
	.remove_button:focus {
		background: #b71c1c;
	}
	.move_button {
		background: #e0e0e0;
		color: #333;
	}
	.move_button:hover,
	.move_button:focus {
		background: #bdbdbd;
	}
	.add_button:disabled,
	.remove_button:disabled,
	.move_button:disabled {
		background: #f5f5f5;
		color: #bdbdbd;
		cursor: not-allowed;
		box-shadow: none;
	}
	@media (max-width: 600px) {
		.array_component {
			max-width: 100%;
			gap: 10px;
		}
		.item_container {
			flex-direction: column;
			gap: 8px;
			padding: 10px 4px 8px 4px;
		}
		.item_controls_container {
			flex-direction: row;
			align-items: stretch;
			justify-content: space-between;
			min-width: 0;
			width: 100%;
			gap: 6px;
			margin-top: 4px;
		}
		.add_button,
		.remove_button,
		.move_button {
			width: 100%;
			min-width: 0;
			max-width: none;
			padding: 8px 0;
			font-size: 0.9rem;
		}
	}
</style>
