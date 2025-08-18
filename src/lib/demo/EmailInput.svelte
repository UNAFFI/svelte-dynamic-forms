<script>
  let { field_metadata = $bindable(), field_data = $bindable() } = $props();
  const id = $derived(field_metadata?.field_id);
  const key = $derived(field_metadata?.data_key);
  const cfg = $derived({ ...(field_metadata?.definition?.settings || {}), ...(field_metadata?.dynamic_settings || {}) });
  const isValid = $derived(field_metadata?.validations?.is_valid !== false);
</script>

<div class="field">
  {#if cfg.label}
    <label for={id}>{cfg.label}</label>
  {/if}
  <input id={id} type="email" placeholder={cfg.placeholder} bind:value={field_data[key]} class:error={!isValid} />
  {#if !isValid && field_metadata?.validations?.error_message}
    <div class="error">{field_metadata.validations.error_message}</div>
  {/if}
</div>

<style>
  .field { display: grid; gap: .35rem; }
  input { border: 1px solid #cbd5e1; border-radius: .375rem; padding: .5rem .625rem; font-size: .95rem; }
  input.error { border-color: #ef4444; }
  .error { color: #b91c1c; font-size: .85rem; }
</style>
