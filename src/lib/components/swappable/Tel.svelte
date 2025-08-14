<script>
	import { FORM_CONTEXT, SWAPPABLE_COMPONENTS } from '$lib/symbols';
	import { getContext } from 'svelte';
	import { TelInput, normalizedCountries } from 'svelte-tel-input';
	import 'svelte-tel-input/styles/flags.css';

	// props
	let { placeholder, label, ...rest } = $props();

	// get context
	const context = getContext(FORM_CONTEXT);
	const swappable_components = getContext(SWAPPABLE_COMPONENTS);

	// set state
	let selected_country = $state('ZA');
	let valid = $state(true);
	let country_input_value = $state('');
	let is_country_dropdown_open = $state(false);
	let highlighted_country_index = $state(-1);
	let country_select_ref = $state(/** @type {HTMLDivElement | null} */ (null));
	let country_search_input_ref = $state(/** @type {HTMLInputElement | null} */ (null));
	let filtered_country_options = $state([]);

	// derived state
	const is_display_error = $derived(
		context.show_validation && // not hiding
			rest.state_root?.is_validation_checked && // is checked
			!rest.state_root?.is_valid // invalid
	);
	const selected_option = $derived(filtered_country_options.find((/** @type {any} */ o) => o.is_selected));
	const display_text = $derived(selected_option?.label || placeholder || '');

	// Update options reactively
	$effect(() => {
		// Ensure normalizedCountries is available
		if (!normalizedCountries || !Array.isArray(normalizedCountries)) {
			filtered_country_options = [];
			return;
		}

		// Map all countries
		const all_options = normalizedCountries.map((country) => ({
			label: `<div style="display: flex; flex-direction: row; align-items: center; gap: 8px;" title="${country.name}"><span class="flag flag-${country.iso2.toLowerCase()}"></span> ${country.iso2} (+${country.dialCode})<span class="country-name-search"> <span style="color: #000!important; font-size: 12px!important; padding-right: 4px;">-</span> ${country.name}</span></div>`,
			value: country.iso2,
			country_name: country.name
		}));

		// Filter based on input
		if (!country_input_value || !country_input_value.trim()) {
			filtered_country_options = all_options;
		} else {
			const search_term = country_input_value.toLowerCase().trim();
			filtered_country_options = all_options.filter(
				(option) =>
					option.country_name.toLowerCase().includes(search_term) ||
					option.value.toLowerCase().includes(search_term)
			);
		}
	});

	// Prevent user from typing spaces into the TelInput
	function preventSpaceKey(e) {
		if (e.key === ' ') {
			e.preventDefault();
		}
	}

    function selectCountryOption(country_option) {
		selected_country = country_option.value;
		country_input_value = '';
    }

	function toggleDropdown() {
		is_country_dropdown_open = !is_country_dropdown_open;
		if (is_country_dropdown_open) {
			highlighted_country_index = filtered_country_options.findIndex((/** @type {any} */ o) => o.is_selected);
			if (highlighted_country_index === -1 && filtered_country_options.length > 0) {
				highlighted_country_index = 0;
			}
			// Focus the search input when opening
			setTimeout(() => {
				if (country_search_input_ref) {
					country_search_input_ref.focus();
				}
			}, 10);
		} else {
			// Clear search when closing
			if (rest.state_root) {
				country_input_value = '';
			}
		}
	}

	function selectCurrentOption() {
		if (highlighted_country_index >= 0 && highlighted_country_index < filtered_country_options.length) {
			selectCountryOption(filtered_country_options[highlighted_country_index]);
			is_country_dropdown_open = false;
			highlighted_country_index = -1;
			// Clear search after selection
			if (rest.state_root) {
				country_input_value = '';
			}
		}
	}

	function clearSelection() {
		selectCountryOption({ value: null, label: '' });
		is_country_dropdown_open = false;
		highlighted_country_index = -1;
		// Clear search when clearing selection
		if (rest.state_root) {
			country_input_value = '';
		}
	}

	/**
	 * @param {KeyboardEvent} event
	 */
	function handleKeydown(event) {
		if (!is_country_dropdown_open) {
			if (
				event.key === 'Enter' ||
				event.key === ' ' ||
				event.key === 'ArrowDown' ||
				event.key === 'ArrowUp'
			) {
				event.preventDefault();
				toggleDropdown();
			}
			return;
		}

		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				is_country_dropdown_open = false;
				highlighted_country_index = -1;
				break;
			case 'Enter':
				event.preventDefault();
				selectCurrentOption();
				break;
			case 'ArrowDown':
				event.preventDefault();
				highlighted_country_index = Math.min(highlighted_country_index + 1, filtered_country_options.length - 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				highlighted_country_index = Math.max(highlighted_country_index - 1, 0);
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
				is_country_dropdown_open = false;
				highlighted_country_index = -1;
				break;
			case 'Enter':
				event.preventDefault();
				selectCurrentOption();
				break;
			case 'ArrowDown':
				event.preventDefault();
				highlighted_country_index = Math.min(highlighted_country_index + 1, filtered_country_options.length - 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				highlighted_country_index = Math.max(highlighted_country_index - 1, 0);
				break;
		}
	}

	/**
	 * @param {any} option
	 * @param {number} index
	 */
	function handleOptionClick(option, index) {
		selectCountryOption(option);
		is_country_dropdown_open = false;
		highlighted_country_index = -1;
		// Clear search after selection
		if (rest.state_root) {
			country_input_value = '';
		}
	}

	/**
	 * @param {FocusEvent} event
	 */
	function handleBlur(event) {
		// Close dropdown when clicking outside, but allow time for option clicks
		setTimeout(() => {
			if (country_select_ref && !country_select_ref.contains(document.activeElement)) {
				is_country_dropdown_open = false;
				highlighted_country_index = -1;
				// Clear search when closing via blur
				if (rest.state_root) {
					country_input_value = '';
				}
			}
		}, 100);
	}
</script>

<div class="tel_component">
	<swappable_components._label {label} {...rest} />
	<div class="tel_input_container">
		<!-- <div class="w-1/2 @sm:w-1/3">
            <InputSelect
                name="country"
                bind:value={selected_country}
                bind:input_value={country_input_value}
                options={filtered_country_options}
                placeholder="Country"
                is_text_html={true}
                allow_text_filter={true}
                {absolute}
                {disabled}
                {readonly}
                {invalid}
                onchange={handleCountryChange}
                class="rounded-r-none [&_i]:hidden! lg:[&_i]:inline-block!"
            />
        </div> -->

		<div class="country_selector_container">
			<div
				class={['select_button', is_display_error && 'invalid', is_country_dropdown_open && 'open']}
				onclick={toggleDropdown}
				onkeydown={handleKeydown}
				onblur={handleBlur}
				tabindex="0"
				role="combobox"
				aria-controls="options-list"
				aria-haspopup="listbox"
				aria-expanded={is_country_dropdown_open}
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
							onclick={(e) => {
								e.stopPropagation();
								clearSelection();
							}}
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
					<svg
						class={['select_arrow', is_country_dropdown_open && 'open']}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
					>
						<polyline points="6,9 12,15 18,9"></polyline>
					</svg>
				</div>
			</div>

			{#if is_country_dropdown_open}
				<div class="options_container" role="listbox" id="options-list">
					<div class="search_container">
						<input
							bind:this={country_search_input_ref}
							type="text"
							class="search_input"
							placeholder="Search options..."
							bind:value={country_input_value}
							onkeydown={handleSearchKeydown}
						/>
					</div>
					<div class="options_list">
						{#each filtered_country_options as option, index}
							<button
								type="button"
								class={[
									'option',
									option.is_selected && 'selected',
									index === highlighted_country_index && 'highlighted'
								]}
								onclick={() => handleOptionClick(option, index)}
								onmouseenter={() => (highlighted_country_index = index)}
								role="option"
								aria-selected={option.is_selected}
							>
								{option.label}
							</button>
						{/each}
						{#if filtered_country_options.length === 0}
							<div class="no_options">No options available</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		<div class="tel_input">
			<TelInput
				name={rest.definition.name}
				bind:country={selected_country}
				bind:value={rest.data_root[rest.definition.data_key]}
				bind:valid
				bind:detailedValue={rest.state_root.details}
				{placeholder}
				onkeydown={preventSpaceKey}
				options={{
					invalidateOnCountryChange: true,
					format: 'national'
				}}
				class="text-body-md w-full border-0 bg-transparent p-2 focus:outline-none"
				{...rest}
			/>
		</div>
	</div>
	<swappable_components._validation {...rest} />
</div>

<style>
	/* Hide country name in the input display overlay (the HTML overlay when not typing) */
	.tel_component :global(.input-select-container .pointer-events-none .country-name-search) {
		display: none;
	}

	.tel_component :global(.input-select-container input[type='text']) {
		color: #000 !important;
	}

	/* Make dropdown options smaller font size */
	.tel_component :global(.dropdown-container button) {
		font-size: 12px !important;
		color: #818181 !important;
	}

	/* Show country name in dropdown options with smaller font */
	:global(.country-name-search) {
		font-weight: normal;
		font-size: 10px !important;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex-shrink: 1;
		min-width: 0;
	}

	/* Hide country name only in the input display, not in dropdown */
	:global(.pointer-events-none .country-name-search) {
		display: none;
	}

	/* Ensure flag classes work properly */
	:global(.flag) {
		display: inline-block !important;
		width: 14px;
		height: 10px;
		background-size: cover;
		flex-shrink: 0;
	}
</style>
