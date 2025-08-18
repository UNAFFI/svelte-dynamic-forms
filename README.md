# Svelte Dynamic Forms

A dynamic form library for **Svelte 5** with validation, conditional field rendering, reactive dependencies, and template-based configuration.

👉 Docs & Playground: https://svelte-dynamic-forms.unaffi.com/

## Installation

```bash
npm install svelte-dynamic-forms
```

## Quick Start

Create a simple form with validation and conditional fields:

```svelte
<script>
	import { Form, Field } from 'svelte-dynamic-forms';
	import TextInput from './TextInput.svelte';
	import EmailInput from './EmailInput.svelte';

	let formData = $state({});
	let formMetadata = $state({});

	const components = { 
		text: TextInput, 
		email: EmailInput 
	};

	const fields = [
		{ 
			fieldtype: 'text', 
			name: 'First Name',
			validations: [
				{
					expression: '[[jsonata]]$length(field_data.first_name) >= 2',
					error_message: 'Name must be at least 2 characters'
				}
			]
		},
		{ 
			fieldtype: 'email', 
			name: 'Email Address',
			dependencies: ['data.first_name'],
			conditions: [
				{
					expression: '[[jsonata]]data.first_name and $length(data.first_name) > 0'
				}
			]
		}
	];

	// Access form validation state
	$effect(() => {
		console.log('Form valid:', formMetadata?.validations?.is_valid);
		console.log('Form data:', formData);
	});
</script>

<Form 
	bind:data={formData} 
	bind:metadata={formMetadata}
	{fields} 
	{components} 
/>
```

### Basic Custom Component

Create input components that work with the library:

```svelte
<!-- TextInput.svelte -->
<script>
	let { field_metadata = $bindable(), field_data = $bindable() } = $props();
	
	const value = $derived(field_data?.[field_metadata?.data_key] || '');
	const isValid = $derived(field_metadata?.validations?.is_valid !== false);
	const errorMessage = $derived(field_metadata?.validations?.error_message);
</script>

<input
	type="text"
	bind:value={field_data[field_metadata?.data_key]}
	class:error={!isValid}
/>
{#if !isValid && errorMessage}
	<span class="error">{errorMessage}</span>
{/if}
```

## Key Features

- 🔄 **Dynamic Field Rendering** - Show/hide fields based on conditions
- ✅ **Automatic Validation** - Real-time validation with dependency tracking
- 📊 **Reactive Dependencies** - Fields automatically update when dependencies change
- 🎯 **Default Values** - Smart default value management per field type
- 📝 **Template Support** - Mustache and JSONata expressions for dynamic configuration
- ⚡ **Svelte 5 Native** - Built with modern Svelte 5 runes and patterns

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Field Component](#field-component)
  - [Form Component](#form-component)
- [Concepts](#concepts)
  - [Component Interface](#component-interface)
  - [Template Evaluation](#template-evaluation)
  - [Settings and Dynamic Settings](#settings-and-dynamic-settings)
- [Requirements](#requirements)
- [License](#license)
- [Contributing](#contributing)
- [Support](#support)

## API Reference

## Field Component

The Field component renders individual form fields with dynamic behavior. When used standalone, it only has access to its own data and metadata.

### Basic Example

```svelte
<script>
	import { Field } from 'svelte-dynamic-forms';
	import TextInput from './TextInput.svelte';

	let fieldData = $state({});
	let fieldMetadata = $state({});
</script>

<Field
	fieldtype="text"
	name="First Name"
	component={TextInput}
	bind:field_data={fieldData}
	bind:field_metadata={fieldMetadata}
/>
```

### Properties

#### `field_data`

Bindable object containing the field's data. The field will write its value to this object using the field's data key.

```svelte
<script>
	let fieldData = $state({ first_name: 'John' });
</script>

<Field fieldtype="text" name="First Name" bind:field_data={fieldData} />
```

#### `field_metadata`

Bindable object containing the field's metadata including validation state, conditions, and configuration. This provides insight into the field's current state.

```svelte
<script>
	let fieldMetadata = $state({});

	// Access validation state
	$effect(() => {
		if (fieldMetadata.validations?.is_valid === false) {
			console.log('Field is invalid:', fieldMetadata.validations.error_message);
		}
	});
</script>

<Field bind:field_metadata={fieldMetadata} />
```

#### `fieldtype`

String that identifies the field type and maps to a component. Can be a template expression that evaluates on field mount.

```svelte
<!-- Static fieldtype -->
<Field fieldtype="text" component={TextInput} />

<!-- Dynamic fieldtype with JSONata (requires Form context) -->
<Field fieldtype="[[jsonata]]field_metadata.userRole = 'admin' ? 'admin_text' : 'text'" />
```

#### `name`

Display name of the field. Used for labels and generating the field ID. Can be a template expression.

```svelte
<!-- Static name -->
<Field name="Email Address" />

<!-- Dynamic name with JSONata function -->
<Field name="[[jsonata]]'Entry created at ' & $now()" />
```

#### `component`

Direct component override. If provided, this component will be used instead of looking up the fieldtype in the components map.

```svelte
<script>
	import CustomInput from './CustomInput.svelte';
</script>

<Field fieldtype="text" name="Special Field" component={CustomInput} />
```

#### `dependencies`

Array of data paths that trigger re-evaluation of dynamic field properties when they change. When used standalone, can only reference the field's own data.

```svelte
<Field
	fieldtype="text"
	name="Username"
	dependencies={['field_data.username']}
	validations={[
		{
			expression: '[[jsonata]]$length(field_data.username) >= 3',
			error_message: 'Username must be at least 3 characters'
		}
	]}
/>
```

#### `default_value`

Initial value for the field. Can be a static value or template expression that evaluates on field mount.

```svelte
<!-- Static default -->
<Field default_value="Hello World" />

<!-- JSONata expression using built-in functions -->
<Field default_value="[[jsonata]]$now()" />

<!-- JSONata expression with string manipulation -->
<Field default_value="[[jsonata]]'Created on ' & $substring($now(), 0, 10)" />
```

#### `settings`

Static field settings that are evaluated once when the field mounts. Use for configuration that doesn't need to change.

```svelte
<Field
	fieldtype="select"
	settings={{
		placeholder: 'Choose an option',
		multiple: false,
		options: [
			{ value: 'a', label: 'Option A' },
			{ value: 'b', label: 'Option B' }
		]
	}}
/>
```

#### `dynamic_settings`

Field settings that re-evaluate whenever dependencies change. Use for configuration that needs to be reactive.

```svelte
<Field
	fieldtype="select"
	name="Options"
	dependencies={['field_data.category']}
	dynamic_settings={{
		options: '[[jsonata]]field_metadata.availableOptions[field_data.category]'
	}}
/>
```

#### `validations`

Array of validation rules that check field data. Each rule has an expression and error message. Validations re-run when dependencies change.

```svelte
<Field
	fieldtype="text"
	name="Age"
	dependencies={['field_data.age']}
	validations={[
		{
			expression: '[[jsonata]]field_data.age and field_data.age >= 18',
			error_message: 'Must be 18 or older'
		},
		{
			expression: '[[jsonata]]field_data.age <= 100',
			error_message: 'Must be 100 or younger'
		}
	]}
/>
```

#### `conditions`

Array of conditions that determine if the field should be rendered. If any condition fails, the field is hidden.

```svelte
<Field
	fieldtype="text"
	name="Additional Info"
	dependencies={['field_data.show_extra']}
	conditions={[
		{
			expression: '[[jsonata]]field_data.show_extra = true'
		}
	]}
/>
```

#### `keep_data_on_conditions_failed`

Boolean that controls whether field data is preserved when conditions fail. By default, data is cleared when a field becomes hidden.

```svelte
<Field
	fieldtype="text"
	name="Optional Details"
	dependencies={['field_data.show_details']}
	keep_data_on_conditions_failed={true}
	conditions={[
		{
			expression: '[[jsonata]]field_data.show_details = true'
		}
	]}
/>
```

When `keep_data_on_conditions_failed` is `true`, the field's data remains in the form data even when the field is hidden. When `false` (default), the data is removed when conditions fail.

> **Note**: When using Field components standalone (without Form), they can only access their own `field_data` and `field_metadata`. Cross-field references like `data.otherField` require the Form component for shared context.

## Form Component

The Form component creates a shared context that enables Fields to work together reactively. It provides form-wide data management, cross-field validation, component mapping, and centralized state. Fields within a Form can reference each other's data and benefit from shared configuration.

### Declarative Fields

Define all fields in a single array for automatic rendering:

```svelte
<script>
	import { Form } from 'svelte-dynamic-forms';

	let formData = $state({});
	let formMetadata = $state({});

	const components = {
		text: TextInput,
		email: EmailInput
	};

	const fields = [
		{
			fieldtype: 'text',
			name: 'First Name'
		},
		{
			fieldtype: 'email',
			name: 'Email Address',
			dependencies: ['data.first_name'],
			conditions: [
				{
					expression: '[[jsonata]]data.first_name and $length(data.first_name) > 0'
				}
			]
		}
	];
</script>

<Form bind:data={formData} bind:metadata={formMetadata} {fields} {components} />
```

### Imperative Fields

Place Field components as children for custom layout control:

```svelte
<script>
	import { Form, Field } from 'svelte-dynamic-forms';

	let formData = $state({});
	const components = { text: TextInput };
</script>

<Form bind:data={formData} {components}>
	<div class="form-section">
		<h3>Personal Information</h3>
		<Field fieldtype="text" name="First Name" />
		<Field fieldtype="text" name="Last Name" />
	</div>

	<div class="form-section">
		<h3>Contact</h3>
		<Field fieldtype="email" name="Email" />
	</div>
</Form>
```

### Cross-Field References

Fields can reference other fields' data when inside a Form:

```svelte
<script>
	const fields = [
		{
			fieldtype: 'email',
			name: 'Email',
			validations: [
				{
					expression: '[[jsonata]]$match(field_data.email, /^[^@]+@[^@]+$/)',
					error_message: 'Invalid email format'
				}
			]
		},
		{
			fieldtype: 'email',
			name: 'Confirm Email',
			dependencies: ['data.email', 'field_data.confirm_email'],
			validations: [
				{
					expression: '[[jsonata]]field_data.confirm_email = data.email',
					error_message: 'Emails must match'
				}
			]
		}
	];
</script>

<Form {fields} {components} bind:data={formData} />
```

### Components Prop

Map field types to Svelte components:

```svelte
<script>
	import TextInput from './TextInput.svelte';
	import EmailInput from './EmailInput.svelte';
	import SelectInput from './SelectInput.svelte';

	const components = {
		text: TextInput,
		email: EmailInput,
		select: SelectInput,
		custom_field: CustomFieldComponent
	};
</script>

<Form {components}>
	<Field fieldtype="text" name="Name" />
	<Field fieldtype="email" name="Email" />
	<Field fieldtype="custom_field" name="Special Input" />
</Form>
```

### Default Values

Set default values by field type:

```svelte
<script>
	const defaultValues = {
		text: '',
		number: 0,
		select: null,
		checkbox: false,
		country: 'US'
	};

	const fields = [
		{ fieldtype: 'text', name: 'Name' }, // Gets '' as default
		{ fieldtype: 'country', name: 'Country' }, // Gets 'US' as default
		{ fieldtype: 'text', name: 'Bio', default_value: 'Tell us about yourself' } // Explicit default overrides
	];
</script>

<Form {fields} {components} default_values={defaultValues} />
```

### Validate Function

Programmatically validate the entire form:

```svelte
<script>
	let formComponent;
	let formData = $state({});
	let formSettings = $state({});

	async function handleSubmit() {
		await formComponent.validate();

		if (formSettings.validations.is_valid) {
			console.log('Form is valid, submitting:', formData);
			// Submit the form
		} else {
			console.log('Validation errors:', formSettings.validations.issues);
			// Show validation errors to user
		}
	}
</script>

<Form
	bind:this={formComponent}
	bind:data={formData}
	bind:settings={formSettings}
	{fields}
	{components}
/>

<button onclick={handleSubmit}>Submit</button>
```

### Data Prop

The form data object where all field values are stored:

```svelte
<script>
	// Initialize with existing data
	let formData = $state({
		first_name: 'John',
		last_name: 'Doe',
		email: 'john@example.com'
	});

	// Watch for changes
	$effect(() => {
		console.log('Form data changed:', formData);
	});
</script>

<Form bind:data={formData} {fields} {components} />
```

## Concepts

### Component Interface

The Field component passes only two reactive properties to your custom components: `field_metadata` and `field_data`. Understanding this simple interface is crucial for building custom field components.

#### What Your Component Receives

```svelte
<!-- YourCustomComponent.svelte -->
<script>
  let { field_metadata = $bindable(), field_data = $bindable() } = $props();
  
  // field_metadata contains all field configuration and state
  // field_data contains the actual form data object where this field writes its value
</script>
```

#### field_metadata Structure

The `field_metadata` object contains everything about the field's configuration and current state:

```javascript
{
  field_id: 'first_name',           // Unique field identifier
  data_key: 'first_name',          // Key where field writes its value
  init_value: 'John',              // Initial value from form data
  default_value: '',               // Default value for this field type
  
  // Validation state (reactive)
  validations: {
    is_valid: true,
    error_message: '',
    checks: [...]
  },
  
  // Condition state (reactive)
  conditions: {
    is_passed: true,
    previous_result: true
  },
  
  // Reactive settings (updates when dependencies change)
  dynamic_settings: {
    placeholder: 'Enter your name',
    disabled: false
  },
  
  // Field definition (static configuration)
  definition: {
    name: 'First Name',
    fieldtype: 'text',
    settings: {
      label: 'First Name',
      required: true
    },
    // ... other static properties
  }
}
```

#### field_data Structure

The `field_data` object is where your component reads and writes the field's value:

```svelte
<script>
  let { field_metadata = $bindable(), field_data = $bindable() } = $props();
  
  // Get the current value
  const currentValue = $derived(field_data?.[field_metadata?.data_key] || '');
  
  // Update the value
  function updateValue(newValue) {
    if (field_data && field_metadata?.data_key) {
      field_data[field_metadata.data_key] = newValue;
    }
  }
</script>

<input 
  value={currentValue}
  oninput={(e) => updateValue(e.target.value)}
/>
```

#### Complete Component Example

```svelte
<!-- TextInput.svelte -->
<script>
  let { field_metadata = $bindable(), field_data = $bindable() } = $props();
  
  // Extract commonly used values
  const fieldId = $derived(field_metadata?.field_id);
  const dataKey = $derived(field_metadata?.data_key);
  const currentValue = $derived(field_data?.[dataKey] || '');
  const isValid = $derived(field_metadata?.validations?.is_valid !== false);
  const errorMessage = $derived(field_metadata?.validations?.error_message);
  
  // Get static settings
  const settings = $derived(field_metadata?.definition?.settings || {});
  
  // Get dynamic settings (reactive)
  const dynamicSettings = $derived(field_metadata?.dynamic_settings || {});
  
  // Combine configuration
  const config = $derived({ ...settings, ...dynamicSettings });
  
  function handleInput(event) {
    if (field_data && dataKey) {
      field_data[dataKey] = event.target.value;
    }
  }
</script>

<div class="field-wrapper">
  {#if config.label}
    <label for={fieldId}>{config.label}</label>
  {/if}
  
  <input
    id={fieldId}
    type="text"
    value={currentValue}
    placeholder={config.placeholder}
    disabled={config.disabled}
    required={config.required}
    class:error={!isValid}
    oninput={handleInput}
  />
  
  {#if !isValid && errorMessage}
    <span class="error-message">{errorMessage}</span>
  {/if}
</div>

<style>
  .error {
    border-color: red;
  }
  
  .error-message {
    color: red;
    font-size: 0.875rem;
  }
</style>
```

#### Key Principles

1. **Two-way binding**: Your component must bind to both `field_metadata` and `field_data`
2. **Read from field_data**: Get the current value using `field_data[field_metadata.data_key]`
3. **Write to field_data**: Update values by modifying `field_data[field_metadata.data_key]`
4. **Configuration access**: Use `field_metadata.definition.settings` (static) and `field_metadata.dynamic_settings` (reactive)
5. **Validation state**: Check `field_metadata.validations` for validation results

This simple interface gives your components everything they need while keeping the API clean and predictable.

### Template Evaluation

The library supports dynamic configuration through template expressions using two engines: **Mustache** (default) and **JSONata** (with `[[jsonata]]` prefix). Understanding when templates are evaluated is crucial for building reactive forms.

#### Mustache Templates (Default)

Simple string interpolation for basic dynamic values:

```javascript
{
  name: 'Hello {{context.user.name}}',
  data_path: '{{context.section}}.details'
}
```

#### JSONata Expressions

Advanced expressions with the `[[jsonata]]` prefix for complex logic:

```javascript
{
  name: '[[jsonata]]"Question " & $string(context.questionNumber)',
  default_value: '[[jsonata]]$now()',
  validations: [
    {
      expression: '[[jsonata]]field_data.age >= 18 and field_data.age <= 100',
      error_message: 'Age must be between 18 and 100'
    }
  ]
}
```

#### Static vs Reactive Evaluation

Field properties fall into two categories based on when they're evaluated:

**Static Properties (Evaluated Once on Field Mount):**
- `fieldtype` - Component type determination
- `name` - Field label and ID generation  
- `data_path` - Where the field writes data
- `default_value` - Initial field value
- `settings` - Static configuration options

```javascript
// These are evaluated once when the field mounts
{
  fieldtype: '[[jsonata]]context.userRole = "admin" ? "admin_input" : "text"',
  name: 'User {{context.userName}}',
  default_value: '[[jsonata]]$now()',
  settings: {
    placeholder: 'Enter {{context.fieldHint}}'
  }
}
```

**Reactive Properties (Re-evaluated When Dependencies Change):**
- `validations` - Validation rules
- `conditions` - Visibility conditions
- `dynamic_settings` - Reactive configuration

```javascript
// These re-evaluate every time dependencies change
{
  dependencies: ['data.country', 'field_data.city'],
  validations: [
    {
      expression: '[[jsonata]]field_data.city in context.validCities[data.country]',
      error_message: 'Invalid city for selected country'
    }
  ],
  conditions: [
    {
      expression: '[[jsonata]]data.country != null'
    }
  ],
  dynamic_settings: {
    options: '[[jsonata]]context.cities[data.country]'
  }
}
```

#### Evaluation Context

All templates have access to this context object:

```javascript
{
  context,        // Form-wide context (Form only)
  data,          // Form data (Form only)
  metadata,      // All field metadata (Form only)
  settings,      // Form settings (Form only)
  field_data,    // Current field's data object
  field_metadata // Current field's metadata
}
```

#### Best Practices

1. **Use static properties** for values that won't change during the field's lifecycle
2. **Use reactive properties** for values that should update when other fields change
3. **Minimize dependencies** - only include paths that actually affect the field
4. **Choose the right template engine** - Mustache for simple interpolation, JSONata for logic

```javascript
// Good: Minimal dependencies, appropriate property types
{
  name: 'Confirm Email', // Static - won't change
  dependencies: ['data.email'], // Only what's needed
  validations: [
    {
      expression: '[[jsonata]]field_data.confirm_email = data.email', // Reactive
      error_message: 'Emails must match'
    }
  ]
}

// Avoid: Unnecessary dependencies, wrong property type
{
  name: '[[jsonata]]"Confirm Email"', // Unnecessary template for static value
  dependencies: ['data.email', 'data.first_name'], // first_name not needed
}
```

### Settings and Dynamic Settings

The `settings` and `dynamic_settings` properties are flexible containers for any configuration your custom components need. They're passed to your components and can contain anything from labels and placeholders to complex configuration objects.

#### Settings (Static Configuration)

The `settings` property is evaluated once when the field mounts and contains configuration that doesn't change during the field's lifecycle:

```javascript
{
  fieldtype: 'text',
  name: 'Email',
  settings: {
    placeholder: 'Enter your email address',
    label: 'Email Address',
    helpText: 'We will never share your email',
    required: true,
    autocomplete: 'email',
    icon: 'mail',
    maxLength: 255,
    className: 'email-input'
  }
}
```

#### Dynamic Settings (Reactive Configuration)

The `dynamic_settings` property is re-evaluated whenever dependencies change, perfect for configuration that needs to be reactive:

```javascript
{
  fieldtype: 'select',
  name: 'City',
  dependencies: ['data.country', 'data.state'],
  dynamic_settings: {
    // Options change based on selected country and state
    options: '[[jsonata]]context.cities[data.country][data.state]',
    placeholder: '[[jsonata]]"Select a city in " & data.state',
    disabled: '[[jsonata]]data.country = null or data.state = null',
    loading: '[[jsonata]]field_metadata.isLoadingCities'
  }
}
```

#### Component Integration

Your custom components receive these settings through the field metadata:

```svelte
<!-- CustomInput.svelte -->
<script>
  let { field_metadata = $bindable(), field_data = $bindable() } = $props();
  
  // Access static settings
  const settings = $derived(field_metadata?.definition?.settings || {});
  
  // Access reactive settings
  const dynamicSettings = $derived(field_metadata?.dynamic_settings || {});
  
  // Combine both for final configuration
  const config = $derived({ ...settings, ...dynamicSettings });
</script>

<div class="field-wrapper">
  {#if config.label}
    <label for={field_metadata?.field_id}>{config.label}</label>
  {/if}
  
  <input
    id={field_metadata?.field_id}
    type="text"
    placeholder={config.placeholder}
    disabled={config.disabled}
    maxlength={config.maxLength}
    autocomplete={config.autocomplete}
    class={config.className}
    bind:value={field_data[field_metadata?.data_key]}
  />
  
  {#if config.helpText}
    <small class="help-text">{config.helpText}</small>
  {/if}
</div>
```

#### Use Cases

**Form Layout Configuration:**
```javascript
{
  settings: {
    layout: 'horizontal',
    labelWidth: '120px',
    showAsterisk: true,
    wrapperClass: 'form-group'
  }
}
```

**Input Behavior:**
```javascript
{
  settings: {
    debounceMs: 300,
    clearable: true,
    searchable: true,
    multiSelect: false
  }
}
```

**Conditional UI Elements:**
```javascript
{
  dependencies: ['data.user_role'],
  dynamic_settings: {
    showAdvanced: '[[jsonata]]data.user_role = "admin"',
    helpText: '[[jsonata]]data.user_role = "admin" ? "Advanced configuration" : "Basic settings"'
  }
}
```

**API Configuration:**
```javascript
{
  dependencies: ['data.category'],
  dynamic_settings: {
    apiEndpoint: '[[jsonata]]"/api/options/" & data.category',
    headers: '[[jsonata]]{"Authorization": "Bearer " & context.authToken}'
  }
}
```

The key principle is that **settings** are for static configuration that won't change, while **dynamic_settings** are for reactive configuration that updates based on form state or other dependencies.

## Requirements

- **Svelte 5.0+** - This library is built specifically for Svelte 5 and uses modern runes
- **Node.js 18+** - For development and build processes

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## Support

If you encounter any issues or have questions, please visit the docs at https://svelte-dynamic-forms.unaffi.com/ or [open an issue](https://github.com/UNAFFI/svelte-dynamic-forms/issues) on GitHub.
