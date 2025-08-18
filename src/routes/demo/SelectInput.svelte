<script>
  let { field_metadata = $bindable(), field_data = $bindable() } = $props();
  const id = $derived(field_metadata?.field_id);
  const key = $derived(field_metadata?.data_key);
  const cfg = $derived({ ...(field_metadata?.definition?.settings || {}), ...(field_metadata?.dynamic_settings || {}) });
  const options = $derived(cfg.options || []);
</script>

<div class="field">
  {#if cfg.label}
    <label for={id}>{cfg.label}</label>
  {/if}
  <select id={id} bind:value={field_data[key]} disabled={cfg.disabled}>
    {#if cfg.placeholder}
      <option value="" disabled selected hidden>{cfg.placeholder}</option>
    {/if}
    {#each options as opt}
      <option value={opt.value}>{opt.label}</option>
    {/each}
  </select>
  {#if field_metadata?.validations?.is_valid === false}
    <div class="error">{field_metadata.validations.error_message}</div>
  {/if}
</div>

<style>
  .field { display: grid; gap: .35rem; }
  select { border: 1px solid #cbd5e1; border-radius: .375rem; padding: .5rem .625rem; font-size: .95rem; background: white; }
  .error { color: #b91c1c; font-size: .85rem; }
</style>
