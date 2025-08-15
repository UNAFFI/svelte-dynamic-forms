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

	// Update options reactively
	$effect(() => {
		// Ensure normalizedCountries is available
		if (!normalizedCountries || !Array.isArray(normalizedCountries)) {
			filtered_country_options = [];
			return;
		}

		// Map all countries
		const all_options = normalizedCountries.map((country) => ({
			label: `<div style="display: flex; flex-direction: row; align-items: center; gap: 8px;" title="${country.name}"><span class="flag flag-${country.iso2.toLowerCase()}"></span> <span style="font-weight: 500;">${country.iso2}</span> <span style="color: #666; font-size: 0.9em;">(+${country.dialCode})</span> <span style="color: #666; font-size: 0.85em;">${country.name}</span></div>`,
			value: country.iso2,
			country_name: country.name,
			dial_code: country.dialCode
		}));

		// Filter based on input
		if (!country_input_value || !country_input_value.trim()) {
			filtered_country_options = all_options;
		} else {
			const search_term = country_input_value.toLowerCase().trim();
			filtered_country_options = all_options.filter(
				(option) =>
					option.country_name.toLowerCase().includes(search_term) ||
					option.value.toLowerCase().includes(search_term) ||
					option.dial_code.includes(search_term)
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
		is_country_dropdown_open = false;
		highlighted_country_index = -1;
    }

	function toggleDropdown() {
		is_country_dropdown_open = !is_country_dropdown_open;
		if (is_country_dropdown_open) {
			highlighted_country_index = filtered_country_options.findIndex((/** @type {any} */ o) => o.value === selected_country);
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
            country_input_value = '';
			highlighted_country_index = -1;
		}
	}

	function selectCurrentOption() {
		if (highlighted_country_index >= 0 && highlighted_country_index < filtered_country_options.length) {
			selectCountryOption(filtered_country_options[highlighted_country_index]);
			is_country_dropdown_open = false;
			highlighted_country_index = -1;
			// Clear search after selection
            country_input_value = '';
		}
	}

	function clearSelection() {
		selected_country = '';
		is_country_dropdown_open = false;
		highlighted_country_index = -1;
		// Clear search when clearing selection
        country_input_value = '';
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
		// Clear search after selection
        country_input_value = '';
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
                country_input_value = '';
			}
		}, 100);
	}

	/**
	 * @param {MouseEvent} event
	 */
	function handleClickOutside(event) {
		if (country_select_ref && !country_select_ref.contains(event.target)) {
			is_country_dropdown_open = false;
			highlighted_country_index = -1;
			country_input_value = '';
		}
	}

	// Add click outside listener when dropdown is open
	$effect(() => {
		if (is_country_dropdown_open) {
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	});
</script>

<div class="tel_component">
	<swappable_components._label {label} {...rest} />
	<div class="tel_input_wrapper">
		<div class={['tel_input_container', is_display_error && 'invalid', is_country_dropdown_open && 'focused']} bind:this={country_select_ref}>
			<div class="tel_number_wrapper">
				<TelInput
					name={rest.definition.name}
					bind:country={selected_country}
					bind:value={rest.data_root[rest.definition.data_key]}
					bind:valid
					bind:detailedValue={rest.state_root.details}
                    placeholder="Enter phone number"
					onkeydown={preventSpaceKey}
					options={{
						invalidateOnCountryChange: true,
						format: 'national'
					}}
					class="tel_number_input"
				/>
				<button
					type="button"
					class="country_button"
					onclick={toggleDropdown}
					onkeydown={handleKeydown}
					onblur={handleBlur}
					tabindex="-1"
					aria-label="Select country"
					aria-haspopup="listbox"
					aria-expanded={is_country_dropdown_open}
				>
					{#if selected_country}
						<span class="flag flag-{selected_country.toLowerCase()}"></span>
						<span class="country_code">+{normalizedCountries.find(c => c.iso2 === selected_country)?.dialCode || ''}</span>
					{:else}
						<span class="country_placeholder">🌍</span>
					{/if}
				</button>
			</div>

			{#if is_country_dropdown_open}
				<div class="country_options_container" role="listbox">
					<div class="search_container">
						<input
							bind:this={country_search_input_ref}
							type="text"
							class="search_input"
							placeholder="Search countries..."
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
									option.value === selected_country && 'selected',
									index === highlighted_country_index && 'highlighted'
								]}
								onclick={() => handleOptionClick(option, index)}
								onmouseenter={() => (highlighted_country_index = index)}
								role="option"
								aria-selected={option.value === selected_country}
							>
								{@html option.label}
							</button>
						{/each}
						{#if filtered_country_options.length === 0}
							<div class="no_options">No countries found</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
	<swappable_components._validation {...rest} />
</div>

<style>
	.tel_component {
		display: flex;
		flex-direction: column;
		gap: 2px;
		width: 100%;
		margin-bottom: 16px;
		box-sizing: border-box;
	}

	.tel_input_wrapper {
		position: relative;
		width: 100%;
	}

	.tel_input_container {
		position: relative;
		font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
		font-size: 1rem;
		font-weight: 400;
		color: #222;
		background: #fff;
		border: 1px solid #bdbdbd;
		border-radius: 4px;
		outline: none;
		transition: border-color 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s cubic-bezier(0.4,0,0.2,1);
		box-shadow: 0 1px 2px rgba(60,60,60,0.02);
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tel_input_container:focus-within {
		border-color: #1976d2;
		box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.15);
	}

	.tel_input_container.invalid {
		border-color: #d32f2f;
		background: #fff6f6;
	}

	.tel_input_container.focused {
		border-color: #1976d2;
		box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.15);
	}

	.tel_number_wrapper {
		display: flex;
		align-items: center;
		width: 100%;
		position: relative;
	}

	.country_button {
		position: absolute;
		left: 8px;
		top: 50%;
		transform: translateY(-50%);
		background: #f8f9fa;
		border: 1px solid #e3e8ed;
		border-radius: 6px;
		padding: 20px 8px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 0.85rem;
		color: #1976d2;
		transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
		outline: none;
		min-width: 60px;
		height: 26px;
		box-sizing: border-box;
		z-index: 2;
		opacity: 0.9;
	}

	.country_button:hover {
		background: #1976d2;
		color: white;
		border-color: #1976d2;
		transform: translateY(-50%) scale(1.05);
		opacity: 1;
	}

	.country_button:focus {
		background: #1565c0;
		color: white;
		border-color: #1565c0;
		outline: 2px solid rgba(25, 118, 210, 0.3);
		outline-offset: 2px;
		opacity: 1;
	}

	.country_placeholder {
		color: #666;
		font-size: 0.85rem;
	}

	.country_code {
		font-size: 0.85rem;
		font-weight: 500;
		color: inherit;
	}

	.country_options_container {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		max-width: 300px;
		background: #fff;
		border: 1px solid #bdbdbd;
		border-top: none;
		border-radius: 0 0 4px 4px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		max-height: 250px;
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
		max-height: 200px;
		overflow-y: auto;
		flex: 1;
	}

	.option {
		font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.9rem;
		font-weight: 400;
		color: #222;
		background: #fff;
		border: none;
		padding: 8px 12px;
		width: 100%;
		text-align: left;
		cursor: pointer;
		transition: background-color 0.2s cubic-bezier(0.4,0,0.2,1);
		border-bottom: 1px solid #f0f0f0;
		display: flex;
		align-items: center;
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
		font-size: 0.9rem;
		color: #999;
		padding: 10px 12px;
		text-align: center;
		font-style: italic;
	}

	/* Override TelInput specific styles - make it borderless and fill container */
	.tel_number_wrapper :global(input) {
		font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
		font-size: 1rem !important;
		font-weight: 400 !important;
		color: #222 !important;
		background: transparent !important;
		border: none !important;
		outline: none !important;
		padding: 19px 12px !important;
		padding-left: 100px !important; /* Make space for country button on left */
		width: 100% !important;
		box-sizing: border-box !important;
		margin: 0 !important;
		flex: 1 !important;
		line-height: normal !important;
	}

	.tel_number_wrapper :global(input::placeholder) {
		color: #999 !important;
		opacity: 1 !important;
	}

	.tel_number_wrapper :global(input:focus) {
		outline: none !important;
		border: none !important;
		box-shadow: none !important;
	}

	/* Flag styling */
	:global(.flag) {
		display: inline-block !important;
		width: 16px;
		height: 12px;
		background-size: cover;
		flex-shrink: 0;
		border-radius: 2px;
	}
</style>
