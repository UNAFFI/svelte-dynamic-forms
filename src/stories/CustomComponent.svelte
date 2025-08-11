<script>
	// props
	let { ...rest } = $props();
</script>

<button onclick={() => (rest.data_root[rest.definition.data_key] = 'Yellow')} type="button">
	Yellow
</button>

<button onclick={() => (rest.data_root[rest.definition.data_key] = 'Blue')} type="button">
	Blue
</button>

<button onclick={() => (rest.data_root[rest.definition.data_key] = 'Red')} type="button">
	Red
</button>

<button onclick={() => (rest.data_root[rest.definition.data_key] = 'Green')} type="button">
	Green
</button>

<style>
	button {
		min-width: 80px;
		padding: 8px 16px;
		margin: 6px 8px 6px 0;
		font-size: 0.875rem;
		font-weight: 500;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		color: white;
		font-family: Roboto, Arial, sans-serif;
		transition: background-color 0.2s ease, box-shadow 0.2s ease;
	}

	button:hover {
		filter: brightness(0.9);
		box-shadow: 0 2px 6px rgba(0,0,0,0.2);
	}

	button:focus {
		outline: 3px solid rgba(25, 118, 210, 0.6);
		outline-offset: 2px;
	}

	button:nth-child(1) {
		background-color: #fbc02d; /* Yellow 700 */
		color: rgba(0, 0, 0, 0.87);
	}

	button:nth-child(2) {
		background-color: #1976d2; /* Blue 700 */
	}

	button:nth-child(3) {
		background-color: #d32f2f; /* Red 700 */
	}

	button:nth-child(4) {
		background-color: #388e3c; /* Green 700 */
	}
</style>
