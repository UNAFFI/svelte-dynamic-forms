<script>
	import { FORM_CONTEXT, SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import { getContext } from 'svelte';

	// props
	let { selectOption, options, placeholder, label, ...rest } = $props();

	// get context
	const context = getContext(FORM_CONTEXT);
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);

	// local state
	let isOpen = $state(false);
	let highlightedIndex = $state(-1);
	let selectRef = $state(/** @type {HTMLDivElement | null} */ (null));
	let searchInputRef = $state(/** @type {HTMLInputElement | null} */ (null));

	// derived state
	const is_display_error = $derived(
		context.show_validation && // not hiding
			rest.state_root?.is_validation_checked && // is checked
			!rest.state_root?.is_valid // invalid
	);
	const filtered_options = $derived(options.filter((/** @type {any} */ o) => !o.is_filtered_out));
	const selected_option = $derived(options.find((/** @type {any} */ o) => o.is_selected));
	const display_text = $derived(selected_option?.label || placeholder || '');
	const search_text = $derived(rest.state_root.select_filter_text || '');

	// functions
	function toggleDropdown() {
		isOpen = !isOpen;
		if (isOpen) {
			highlightedIndex = filtered_options.findIndex((/** @type {any} */ o) => o.is_selected);
			if (highlightedIndex === -1 && filtered_options.length > 0) {
				highlightedIndex = 0;
			}
			// Focus the search input when opening
			setTimeout(() => {
				if (searchInputRef) {
					searchInputRef.focus();
				}
			}, 10);
		} else {
			// Clear search when closing
			if (rest.state_root) {
				rest.state_root.select_filter_text = '';
			}
		}
	}

	function selectCurrentOption() {
		if (highlightedIndex >= 0 && highlightedIndex < filtered_options.length) {
			selectOption(filtered_options[highlightedIndex]);
			isOpen = false;
			highlightedIndex = -1;
			// Clear search after selection
			if (rest.state_root) {
				rest.state_root.select_filter_text = '';
			}
		}
	}

	function clearSelection() {
		selectOption({ value: null, label: '' });
		isOpen = false;
		highlightedIndex = -1;
		// Clear search when clearing selection
		if (rest.state_root) {
			rest.state_root.select_filter_text = '';
		}
	}

	/**
	 * @param {KeyboardEvent} event
	 */
	function handleKeydown(event) {
		if (!isOpen) {
			if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				event.preventDefault();
				toggleDropdown();
			}
			return;
		}

		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				isOpen = false;
				highlightedIndex = -1;
				break;
			case 'Enter':
				event.preventDefault();
				selectCurrentOption();
				break;
			case 'ArrowDown':
				event.preventDefault();
				highlightedIndex = Math.min(highlightedIndex + 1, filtered_options.length - 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				highlightedIndex = Math.max(highlightedIndex - 1, 0);
				break;
		}
	}

	/**
	 * @param {KeyboardEvent} event
	 */
	function handleSearchKeydown(event) {
		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				isOpen = false;
				highlightedIndex = -1;
				break;
			case 'Enter':
				event.preventDefault();
				selectCurrentOption();
				break;
			case 'ArrowDown':
				event.preventDefault();
				highlightedIndex = Math.min(highlightedIndex + 1, filtered_options.length - 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				highlightedIndex = Math.max(highlightedIndex - 1, 0);
				break;
		}
	}

	/**
	 * @param {any} option
	 * @param {number} index
	 */
	function handleOptionClick(option, index) {
		selectOption(option);
		isOpen = false;
		highlightedIndex = -1;
		// Clear search after selection
		if (rest.state_root) {
			rest.state_root.select_filter_text = '';
		}
	}

	/**
	 * @param {FocusEvent} event
	 */
	function handleBlur(event) {
		// Close dropdown when clicking outside, but allow time for option clicks
		setTimeout(() => {
			if (selectRef && !selectRef.contains(document.activeElement)) {
				isOpen = false;
				highlightedIndex = -1;
				// Clear search when closing via blur
				if (rest.state_root) {
					rest.state_root.select_filter_text = '';
				}
			}
		}, 100);
	}
</script>

<div class="select_component" bind:this={selectRef}>
	<swappable_components._label {label} {...rest} />
	<div class="select_wrapper">
		<div
			class={['select_button', is_display_error && 'invalid', isOpen && 'open']}
			onclick={toggleDropdown}
			onkeydown={handleKeydown}
			onblur={handleBlur}
			tabindex="0"
			role="combobox"
			aria-controls="options-list"
			aria-haspopup="listbox"
			aria-expanded={isOpen}
			aria-label={label || 'Select an option'}
		>
			<span class={['select_text', !selected_option && 'placeholder']}>
				{display_text}
			</span>
			<div class="select_controls">
				{#if selected_option}
					<button
						type="button"
						class="clear_button"
						onclick={(e) => { e.stopPropagation(); clearSelection(); }}
						aria-label="Clear selection"
						title="Clear selection"
						tabindex="-1"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				{/if}
				<svg class={['select_arrow', isOpen && 'open']} viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<polyline points="6,9 12,15 18,9"></polyline>
				</svg>
			</div>
		</div>
		
		{#if isOpen}
			<div class="options_container" role="listbox" id="options-list">
				<div class="search_container">
					<input
						bind:this={searchInputRef}
						type="text"
						class="search_input"
						placeholder="Search options..."
						bind:value={rest.state_root.select_filter_text}
						onkeydown={handleSearchKeydown}
					/>
				</div>
				<div class="options_list">
					{#each filtered_options as option, index}
						<button
							type="button"
							class={['option', option.is_selected && 'selected', index === highlightedIndex && 'highlighted']}
							onclick={() => handleOptionClick(option, index)}
							onmouseenter={() => highlightedIndex = index}
							role="option"
							aria-selected={option.is_selected}
						>
							{option.label}
						</button>
					{/each}
					{#if filtered_options.length === 0}
						<div class="no_options">No options available</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
	<swappable_components._validation {...rest} />
</div>

<style>
	.select_component {
		display: flex;
		flex-direction: column;
		gap: 2px;
		width: 100%;
		margin-bottom: 16px;
		box-sizing: border-box;
	}

	.select_wrapper {
		position: relative;
		width: 100%;
	}

	.select_button {
		font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
		font-size: 1rem;
		font-weight: 400;
		color: #222;
		background: #fff;
		border: 1px solid #bdbdbd;
		border-radius: 4px;
		padding: 10px 12px;
		outline: none;
		transition: border-color 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s cubic-bezier(0.4,0,0.2,1);
		box-shadow: 0 1px 2px rgba(60,60,60,0.02);
		width: 100%;
		box-sizing: border-box;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		text-align: left;
		min-height: 42px;
	}

	.select_button:focus {
		border-color: #1976d2;
		box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.15);
	}

	.select_button.invalid {
		border-color: #d32f2f;
		background: #fff6f6;
	}

	.select_button:disabled {
		background: #f5f5f5;
		color: #bdbdbd;
		border-color: #e0e0e0;
		cursor: not-allowed;
	}

	.select_button.open {
		border-color: #1976d2;
		box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.15);
	}

	.select_text {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.select_text.placeholder {
		color: #999;
	}

	.select_controls {
		display: flex;
		align-items: center;
		gap: 4px;
		margin-left: 8px;
		flex-shrink: 0;
	}

	.clear_button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		padding: 0;
		background: none;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		color: #666;
		transition: background-color 0.2s cubic-bezier(0.4,0,0.2,1), color 0.2s cubic-bezier(0.4,0,0.2,1);
		outline: none;
	}

	.clear_button:hover {
		background: #f0f0f0;
		color: #333;
	}

	.clear_button:focus {
		background: #e0e0e0;
		color: #333;
	}

	.clear_button svg {
		width: 12px;
		height: 12px;
	}

	.select_arrow {
		width: 20px;
		height: 20px;
		color: #666;
		transition: transform 0.2s cubic-bezier(0.4,0,0.2,1);
		flex-shrink: 0;
	}

	.select_arrow.open {
		transform: rotate(180deg);
	}

	.options_container {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: #fff;
		border: 1px solid #bdbdbd;
		border-top: none;
		border-radius: 0 0 4px 4px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		max-height: 200px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.search_container {
		padding: 8px;
		border-bottom: 1px solid #f0f0f0;
		background: #fafafa;
	}

	.search_input {
		font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.9rem;
		font-weight: 400;
		color: #222;
		background: #fff;
		border: 1px solid #ddd;
		border-radius: 3px;
		padding: 6px 8px;
		width: 100%;
		box-sizing: border-box;
		outline: none;
		transition: border-color 0.2s cubic-bezier(0.4,0,0.2,1);
	}

	.search_input:focus {
		border-color: #1976d2;
	}

	.options_list {
		max-height: 160px;
		overflow-y: auto;
		flex: 1;
	}

	.option {
		font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
		font-size: 1rem;
		font-weight: 400;
		color: #222;
		background: #fff;
		border: none;
		padding: 10px 12px;
		width: 100%;
		text-align: left;
		cursor: pointer;
		transition: background-color 0.2s cubic-bezier(0.4,0,0.2,1);
		border-bottom: 1px solid #f0f0f0;
	}

	.option:last-child {
		border-bottom: none;
	}

	.option:hover,
	.option.highlighted {
		background: #f5f5f5;
	}

	.option.selected {
		background: #e3f2fd;
		color: #1976d2;
		font-weight: 500;
	}

	.option.selected.highlighted {
		background: #bbdefb;
	}

	.no_options {
		font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
		font-size: 1rem;
		color: #999;
		padding: 10px 12px;
		text-align: center;
		font-style: italic;
	}
</style>
