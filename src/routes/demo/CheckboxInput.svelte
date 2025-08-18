<script>
  let { field_metadata = $bindable(), field_data = $bindable() } = $props();
  const key = $derived(field_metadata?.data_key);
  const id = $derived(field_metadata?.field_id);
  const cfg = $derived({ ...(field_metadata?.definition?.settings || {}), ...(field_metadata?.dynamic_settings || {}) });
</script>

<label class="checkbox">
  <input id={id} type="checkbox" bind:checked={field_data[key]} disabled={cfg.disabled} />
  <span>{cfg.label}</span>
</label>

<style>
  .checkbox { display: inline-flex; align-items: center; gap: .5rem; cursor: pointer; }
  input { width: 1rem; height: 1rem; }
</style>
