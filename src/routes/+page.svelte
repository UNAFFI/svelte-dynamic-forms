<script>
	import { Form, Field } from '$lib';
	import TextInput from './demo/TextInput.svelte';
	import EmailInput from './demo/EmailInput.svelte';
	import SelectInput from './demo/SelectInput.svelte';
	import CheckboxInput from './demo/CheckboxInput.svelte';

	/** @type {any} */
	let data = $state({});
	/** @type {any} */
	let metadata = $state({});
	/** @type {any} */
	let form_settings = $state({ validations: { is_show: false } });
	let showValidation = $state(false);
	let ctx = $state({ user: { name: 'Alex' }, authToken: 'demo-token-123' });
	/** @type {any} */
	let formRef;

	/** @type {Record<string, any>} */
	const components = {
		text: TextInput,
		email: EmailInput,
		select: SelectInput,
		checkbox: CheckboxInput
	};
	const default_values = { text: '', email: '', select: null, checkbox: false };

	// Demo field list covering: static + reactive templates, dependencies, validations, conditions, dynamic_settings, parent paths
	const demoFields = [
		{
			fieldtype: 'text',
			name: 'First Name',
			settings: { label: 'First Name', placeholder: 'Jane' },
			dependencies: ['field_data.first_name'],
			validations: [
				{
					expression: '[[jsonata]]$length(field_data.first_name) >= 2',
					error_message: 'Must be at least 2 characters'
				}
			]
		},
		{
			fieldtype: 'text',
			name: 'Last Name',
			settings: { label: 'Last Name', placeholder: 'Doe' },
			dependencies: ['field_data.last_name'],
			validations: [
				{ expression: '[[jsonata]]$length(field_data.last_name) > 0', error_message: 'Required' }
			]
		},
		{
			fieldtype: 'email',
			name: 'Email',
			settings: { label: 'Email', placeholder: 'name@example.com' },
			dependencies: ['field_data.email'],
			validations: [
				{
					expression: '[[jsonata]]$match(field_data.email, /^[^@]+@[^@]+.[^@]+$/)',
					error_message: 'Invalid email'
				}
			]
		},
		{
			fieldtype: 'email',
			name: 'Confirm Email',
			settings: { label: 'Confirm Email' },
			dependencies: ['data.email', 'field_data.confirm_email'],
			validations: [
				{
					expression: '[[jsonata]]field_data.confirm_email = data.email',
					error_message: 'Emails must match'
				}
			]
		},
		{
			fieldtype: 'checkbox',
			name: 'Show Advanced',
			settings: { label: 'Show advanced options' }
		},
		{
			fieldtype: 'select',
			name: 'Role',
			settings: { label: 'Role', placeholder: 'Choose a role' },
			dynamic_settings: {
				options: [
					{ value: 'user', label: 'User' },
					{ value: 'admin', label: 'Admin' }
				]
			}
		},
		{
			fieldtype: 'text',
			name: 'Admin Code',
			settings: { label: 'Admin Code', placeholder: 'Only visible when Role=Admin' },
			dependencies: ['data.role', 'field_data.admin_code'],
			conditions: [{ expression: '[[jsonata]]data.role = "admin"' }],
			validations: [
				{
					expression: '[[jsonata]]data.role != "admin" or ($length(field_data.admin_code) >= 6)',
					error_message: 'Admin code min 6 chars'
				}
			]
		},
		{
			fieldtype: 'text',
			name: 'Username',
			settings: { label: 'Username' },
			dependencies: ['data.first_name', 'data.last_name', 'field_data.username'],
			dynamic_settings: {
				placeholder:
					'[[jsonata]](data.first_name and data.last_name) ? (data.first_name & "." & data.last_name) : "Pick a username"'
			},
			validations: [
				{
					expression: '[[jsonata]]$length(field_data.username) >= 3',
					error_message: 'Min 3 characters'
				}
			]
		},
		{
			fieldtype: 'text',
			name: 'Greeting',
			// demonstrate static evaluation via Mustache and JSONata
			settings: { label: 'Greeting', placeholder: 'Hello {{context.user.name}}' },
			default_value: '[[jsonata]]"Hi " & (context.user.name)',
			dependencies: ['context.user.name']
		},
		{
			fieldtype: 'text',
			name: 'Address Line 1',
			settings: { label: 'Address Line 1' },
			data_path: 'address.line1'
		},
		{
			fieldtype: 'text',
			name: 'Address Line 2',
			settings: { label: 'Address Line 2' },
			data_path: 'address.line2'
		},
		{
			fieldtype: 'text',
			name: 'City',
			settings: { label: 'City' },
			data_path: 'address.city',
			dependencies: ['field_data.city'],
			validations: [
				{ expression: '[[jsonata]]$length(field_data.city) > 0', error_message: 'City is required' }
			]
		},
		{
			fieldtype: 'select',
			name: 'Country',
			settings: { label: 'Country', placeholder: 'Select country' },
			dynamic_settings: {
				options: [
					{ value: 'US', label: 'United States' },
					{ value: 'CA', label: 'Canada' }
				]
			},
			data_path: 'address.country'
		},
		{
			fieldtype: 'select',
			name: 'State/Province',
			settings: { label: 'State/Province', placeholder: 'Select' },
			data_path: 'address.state',
			dependencies: ['data.address.country'],
			dynamic_settings: {
				options: `[[jsonata]]{
						"US": [ {"value":"CA","label":"California"}, {"value":"NY","label":"New York"} ],
						"CA": [ {"value":"ON","label":"Ontario"}, {"value":"BC","label":"British Columbia"} ]
					}[data.address.country]`
			},
			validations: [
				{
					expression: '[[jsonata]]data.address.country and field_data.state',
					error_message: 'Select a state/province'
				}
			]
		}
	];

	async function runValidation() {
		await formRef?.validate?.();
	}

	$inspect(
		'[SDF]: Form valid?',
		form_settings?.validations?.is_valid,
		'Issues:',
		form_settings?.validations?.issues
	).with(console.debug);
</script>

<section id="playground">
	<h2>Interactive Playground</h2>
	<p>
		Explore dynamic fields, validations, conditions, defaults, and reactive settings. Edit values to
		see live updates.
	</p>
	<div class="grid">
		<div class="card">
			<Form
				bind:this={formRef}
				bind:data
				bind:metadata
				bind:form_settings
				{components}
				{default_values}
				context={ctx}
				fields={demoFields}
			/>
			<div class="toolbar">
				<button class="btn" onclick={runValidation}>Validate form</button>
				<label class="toggle">
					<input
						type="checkbox"
						bind:checked={showValidation}
						onchange={() => (form_settings.validations.is_show = showValidation)}
					/>
					Show validation state
				</label>
			</div>
		</div>
		<div class="card">
			<h3>Form Data</h3>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
		<div class="card">
			<h3>Form Settings</h3>
			<pre>{JSON.stringify(form_settings, null, 2)}</pre>
		</div>
		<div class="card">
			<h3>Metadata</h3>
			<pre>{JSON.stringify(
					Object.fromEntries(Object.entries(metadata || {}).slice(0, 12)),
					null,
					2
				)}{Object.keys(metadata || {}).length > 12 ? '\n...more' : ''}</pre>
		</div>
	</div>
</section>

<section id="features">
	<h2>Features</h2>
	<ul>
		<li>
			Dynamic rendering via <strong>conditions</strong> and reactive <strong>dependencies</strong>
		</li>
		<li>
			Real-time <strong>validations</strong> with aggregated form state and <code>validate()</code> API
		</li>
		<li>Static <strong>settings</strong> and reactive <strong>dynamic_settings</strong></li>
		<li>Mustache and JSONata <strong>template</strong> evaluation with shared context</li>
		<li>
			Type-based <strong>default values</strong> and nested <strong>data_path</strong> support
		</li>
		<li>Standalone <code>&lt;Field&gt;</code> or Form-scoped usage</li>
	</ul>
</section>

<section id="api">
	<h2>API</h2>
	<p>See the README for full details. Quick reference:</p>
	<ul>
		<li>
			<code>Form</code> props: <code>fields</code>, <code>components</code>, <code>bind:data</code>,
			<code>bind:metadata</code>, <code>bind:settings</code>, <code>context</code>,
			<code>default_values</code>
		</li>
		<li>
			<code>Form.validate()</code> returns after validations settle; results in
			<code>settings.validations</code>
		</li>
		<li>
			<code>Field</code> props: <code>fieldtype</code>, <code>name</code>,
			<code>dependencies</code>, <code>settings</code>, <code>dynamic_settings</code>,
			<code>validations</code>, <code>conditions</code>, <code>data_path</code>,
			<code>default_value</code>
		</li>
	</ul>
</section>

<section id="concepts">
	<h2>Concepts</h2>
	<p>
		Custom components receive two bindable props: <code>field_metadata</code> and
		<code>field_data</code>. Read/write values via <code>field_data[field_metadata.data_key]</code>.
	</p>
</section>

<section id="about">
	<h2>About UNAFFI</h2>
	<p>
		UNAFFI builds products that connect communities through great experiences. One of our platforms,
		UNAFFI Sport, helps people discover and book activities and venues, and enables organisers and
		facilities to manage participation more easily — connecting sports enthusiasts with their
		playgrounds.
	</p>
	<p>
		This library, Svelte Dynamic Forms, is crafted and maintained by UNAFFI to make building rich,
		reactive forms in Svelte 5 fast and enjoyable.
	</p>
	<p>
		Learn more:
		<a href="https://sport.unaffi.com/about" target="_blank" rel="noopener">UNAFFI Sport — About</a>
	</p>
</section>

<style>
	#playground p {
		color: #475569;
		margin-top: 0.25rem;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.card {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 0.5rem;
		padding: 1rem;
	}
	.toolbar {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 0.75rem;
	}
	.btn {
		background: #0ea5e9;
		color: white;
		border: none;
		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;
		cursor: pointer;
	}
	.btn:hover {
		background: #0284c7;
	}
	.toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #334155;
	}
	pre {
		background: #0b10221a;
		border-radius: 0.375rem;
		padding: 0.5rem;
		overflow: auto;
		max-height: 420px;
	}
	@media (max-width: 960px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
	h3 {
		margin-top: 0;
	}
	ul {
		line-height: 1.8;
	}
	code {
		background: #e2e8f0;
		padding: 0 0.25rem;
		border-radius: 0.25rem;
	}
	:global(label + input) {
		margin-left: 0;
	}
</style>
