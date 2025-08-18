<script>
  let { field_metadata = $bindable(), field_data = $bindable() } = $props();
  const id = $derived(field_metadata?.field_id);
  const key = $derived(field_metadata?.data_key);
  const config = $derived({
    ...(field_metadata?.definition?.settings || {}),
    ...(field_metadata?.dynamic_settings || {})
  });
  const value = $derived(field_data?.[key] ?? '');
  const isValid = $derived(field_metadata?.validations?.is_valid !== false);
  const error = $derived(field_metadata?.validations?.error_message);
</script>

<div class="field">
  {#if config.label}
    <label for={id}>{config.label}</label>
  {/if}
  <input id={id} type="text" placeholder={config.placeholder} disabled={config.disabled} bind:value={field_data[key]} class:error={!isValid} />
  {#if !isValid && error}
    <div class="error">{error}</div>
  {/if}
</div>

<style>
  .field { display: grid; gap: .35rem; }
  input { border: 1px solid #cbd5e1; border-radius: .375rem; padding: .5rem .625rem; font-size: .95rem; }
  input:focus { outline: 2px solid #2563eb33; border-color: #2563eb; }
  input.error { border-color: #ef4444; }
  .error { color: #b91c1c; font-size: .85rem; }
</style>
