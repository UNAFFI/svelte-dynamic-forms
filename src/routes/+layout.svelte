<header class="site-header">
  <div class="container">
    <h1>Svelte Dynamic Forms</h1>
    <nav>
      <a href="#playground">Playground</a>
      <a href="#features">Features</a>
      <a href="#api">API</a>
      <a href="#concepts">Concepts</a>
      <a href="#about">About UNAFFI</a>
    </nav>
  </div>
  <div class="sub">Interactive docs — explore validations, conditions, and dynamic settings</div>
</header>

<svelte:head>
  <title>Svelte Dynamic Forms — Interactive Docs by UNAFFI</title>
  <meta name="description" content="Dynamic form library for Svelte 5 with validations, conditions, reactive dependencies, and template-based configuration. Try it live." />
  <link rel="canonical" href="https://svelte-dynamic-forms.unaffi.com/" />
  <meta property="og:title" content="Svelte Dynamic Forms" />
  <meta property="og:description" content="Dynamic form library for Svelte 5 — validations, conditions, and reactive templates. Explore in the interactive playground." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://svelte-dynamic-forms.unaffi.com/" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Svelte Dynamic Forms" />
  <meta name="twitter:description" content="Dynamic forms for Svelte 5 with validations and conditions — by UNAFFI." />
</svelte:head>

<main class="container">
  <slot />
  <footer class="site-footer">
    <div>MIT Licensed • Built with SvelteKit</div>
  </footer>
</main>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji";
    color: #0f172a;
    background: #f8fafc;
  }
  :global(code, pre) { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
  .container { max-width: 1024px; margin-inline: auto; padding: 1rem; }
  .site-header { position: sticky; top: 0; z-index: 10; background: white; border-bottom: 1px solid #e2e8f0; }
  .site-header .container { display: flex; gap: 1rem; align-items: center; justify-content: space-between; }
  .site-header h1 { font-size: 1.1rem; margin: 0; }
  .site-header nav { display: flex; gap: .75rem; }
  .site-header nav a { color: #334155; text-decoration: none; padding: .25rem .5rem; border-radius: .375rem; }
  .site-header nav a:hover { background: #f1f5f9; }
  .site-header .sub { font-size: .9rem; color: #475569; border-top: 1px solid #e2e8f0; padding: .5rem 1rem; }
  .site-footer { margin-top: 3rem; padding: 1rem 0; color: #64748b; border-top: 1px solid #e2e8f0; text-align: center; }
  :global(h2) { margin-top: 2rem; }
  :global(section) { scroll-margin-top: 4.5rem; }
</style>
