<script>
	// props
	let { add, remove, moveUp, moveDown, value = $bindable(), definition, ...rest } = $props();
</script>

{#each value as _, i (`${definition.data_path}_${i}`)}
	<div class="row_wrapper">
		<div class="item_wrapper">
			<rest.field_component
				definition={{
					name: i.toString(),
					fieldtype: 'fieldset',
					fields: definition.item_config?.fields,
					parent_data_path: definition.data_path,
					parent_state_path: definition.state_path
				}}
			/>
		</div>
		<div class="button_group">
			<button type="button" class="remove_button" onclick={() => remove(i)}>Remove</button>
			<button type="button" class="move_button move_up_button" onclick={() => moveUp(i)}
				>Move Up</button
			>
			<button type="button" class="move_button move_down_button" onclick={() => moveDown(i)}
				>Move Down</button
			>
		</div>
	</div>
{/each}
<button type="button" class="add_button" onclick={() => add()}>Add Item</button>

<style>
	/* Container for each row/item */
	.row_wrapper {
		display: flex;
		align-items: flex-start;
		padding: 12px;
		margin-bottom: 12px;
		border: 1px solid rgba(0, 0, 0, 0.12);
		border-radius: 6px;
		background-color: #fafafa;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	/* The editable fieldset takes all available space */
	.item_wrapper {
		flex: 1 1 auto;
		min-width: 0; /* Prevent overflow in flex containers */
	}

	/* Button group container aligned right */
	.button_group {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-left: 16px;
		flex-shrink: 0;
	}

	/* Base button styles */
	.move_button,
	.remove_button,
	.add_button {
		padding: 6px 12px;
		font-size: 0.8125rem; /* 13px */
		font-weight: 500;
		border-radius: 4px;
		border: none;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			box-shadow 0.2s ease;
		font-family: Roboto, Arial, sans-serif;
	}

	.move_button {
		background-color: #e0e0e0;
		color: rgba(0, 0, 0, 0.87);
	}

	.move_button:hover {
		background-color: #d5d5d5;
	}

	.move_up_button::before {
		content: '↑ ';
	}

	.move_down_button::before {
		content: '↓ ';
	}

	.remove_button {
		background-color: #d32f2f;
		color: white;
	}

	.remove_button:hover {
		background-color: #b71c1c;
	}

	.add_button {
		background-color: #1976d2;
		color: white;
		margin-top: 8px;
	}

	.add_button:hover {
		background-color: #115293;
	}
</style>
