# UNAFFI Dynamic Forms

A powerful, feature-rich dynamic form library built for **Svelte 5** that provides sophisticated form functionality with template-based configuration, conditional logic, advanced validation, and reactive data management.

## Features

- 🔄 **Dynamic Field Rendering** - Declarative or imperative field definition
- 📝 **Template-Based Configuration** - Mustache and JSONata expression support
- ✅ **Advanced Validation System** - Real-time, async validation with dependency tracking
- 🎯 **Conditional Logic** - Show/hide fields based on dynamic conditions
- 📊 **Reactive Data Management** - Two-way binding with nested data structures
- 🔗 **Dependency System** - Automatic re-evaluation when dependencies change
- ⚙️ **Context & Settings** - Form-wide context and per-field metadata

## Installation

```bash
npm install unaffi-dynamic-forms
```

## Quick Start

```svelte
<script>
  import { Form } from 'unaffi-dynamic-forms';
  
  let formData = $state({});
  let formMetadata = $state({});
  let formSettings = $state({});
  
  const components = {
    text: TextInput,
    email: EmailInput,
    select: SelectInput
  };
  
  const fields = [
    {
      fieldtype: 'text',
      name: 'First Name',
      validations: [
        {
          expression: '[[jsonata]]field_data.first_name and $length(field_data.first_name) > 0',
          error_message: 'First name is required'
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
</script>

<Form 
  bind:data={formData}
  bind:metadata={formMetadata}
  bind:settings={formSettings}
  {fields}
  {components}
/>
```

## Core Components

### Form Component

The main container that manages form state, validation, and context.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `form_id` | `string` | Unique identifier for the form |
| `show_validation` | `boolean` | Whether to show validation errors |
| `fields` | `FieldProps[]` | Array of field definitions |
| `components` | `Record<string, SvelteComponent>` | Map of fieldtype to components |
| `context` | `any` | Additional context for template evaluation |
| `data` | `object` | Form data (bindable) |
| `default_values` | `Record<string, any>` | Default values by fieldtype |
| `metadata` | `Record<string, FieldMetadata>` | Field metadata (bindable) |
| `settings` | `FormSettings` | Form settings (bindable) |

#### Methods

```svelte
<script>
  let formComponent;
  
  async function validateForm() {
    await formComponent.validate();
    if (formSettings.validations.is_valid) {
      console.log('Form is valid!');
    }
  }
</script>

<Form bind:this={formComponent} ... />
<button onclick={validateForm}>Validate</button>
```

### Field Component

Dynamic field component that renders different field types based on configuration.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `fieldtype` | `string` | Points to component in components map |
| `name` | `string` | Display name of the field |
| `component` | `SvelteComponent` | Direct component override |
| `dependencies` | `string[]` | Dependencies that trigger re-evaluation |
| `data_path` | `string` | Where field writes data |
| `default_value` | `any` | Default value for the field |
| `validations` | `ValidationRule[]` | Validation rules |
| `conditions` | `ConditionRule[]` | Visibility conditions |

## Template System

The library supports two templating engines for dynamic evaluation. **By default, all string templates use Mustache syntax**. To use JSONata expressions, you must prefix them with `[[jsonata]]`.

### Mustache Templates (Default)

Any string without a special prefix uses Mustache syntax for simple interpolation:

```javascript
{
  name: 'Hello {{context.user.name}}',
  data_path: '{{context.section}}.user_info',
  default_value: '{{data.firstName}} {{data.lastName}}'
}
```

### JSONata Expressions

**Must be prefixed with `[[jsonata]]`** for complex expressions and data transformations:

```javascript
{
  // Simple JSONata expression
  default_value: '[[jsonata]]$uppercase(context.user.firstName & " " & context.user.lastName)',
  
  // Array generation
  dependencies: '[[jsonata]]["data.section1", "data.section2"]',
  
  // Conditional logic
  name: '[[jsonata]]data.userType = "admin" ? "Admin Settings" : "User Settings"',
  
  // Complex data filtering
  dynamic_settings: {
    options: '[[jsonata]]context.cities[data.country].$map(function($city) { {"value": $city.id, "label": $city.name} })'
  }
}
```

### Template Evaluation Context

All templates have access to the following context:

```javascript
{
  context,        // Form-wide context
  data,          // Form data
  metadata,      // Field metadata
  settings,      // Form settings
  field_data,    // Current field's data object
  field_metadata // Current field's metadata
}
```

### Examples by Use Case

#### Dynamic Field Names
```javascript
// Mustache (default)
{ name: 'Question {{context.questionNumber}}' }

// JSONata (with prefix)
{ name: '[[jsonata]]"Question " & $string(context.questionNumber) & " of " & $string(context.totalQuestions)' }
```

#### Conditional Values
```javascript
// Mustache (limited conditional support)
{ default_value: '{{#context.isAdmin}}admin@company.com{{/context.isAdmin}}{{^context.isAdmin}}user@company.com{{/context.isAdmin}}' }

// JSONata (more powerful)
{ default_value: '[[jsonata]]context.isAdmin ? "admin@company.com" : "user@company.com"' }
```

#### Complex Dependencies
```javascript
// Must use JSONata for array generation
{ dependencies: '[[jsonata]]$keys(data.sections).$map(function($key) { "data.sections." & $key })' }
```

### Important Notes

⚠️ **Template Prefix Rules:**
- **No prefix** = Mustache template (default) - use for simple string interpolation and basic JavaScript-like boolean expressions
- **`[[jsonata]]` prefix** = JSONata expression - required for advanced operations, data transformations, and robust boolean logic
- You cannot mix both syntaxes in the same string
- Always use JSONata for complex logic, array operations, and advanced data transformations

**When to use each:**
- **Mustache (no prefix)**: Simple string interpolation like `"Hello {{name}}"`
- **JSONata (`[[jsonata]]` prefix)**: Boolean logic, data validation, array operations, mathematical operations, string functions

```javascript
// ✅ Correct - Mustache for simple interpolation
{ name: 'Welcome {{context.user.name}}' }

// ✅ Correct - JSONata for boolean logic and validation
{ expression: '[[jsonata]]field_data.age and field_data.age > 18' }

// ✅ Correct - JSONata for complex operations
{ expression: '[[jsonata]]$length(field_data.password) >= 8 and $match(field_data.email, /^[^@]+@[^@]+$/)' }

// ❌ Wrong - Boolean logic without JSONata prefix
{ expression: 'field_data.age && field_data.age > 18' } // May not work as expected

// ❌ Wrong - Missing JSONata prefix for array operations
{ dependencies: '["data.field1", "data.field2"]' } // This will be treated as Mustache

// ❌ Wrong - Mixing syntaxes
{ name: '[[jsonata]]Welcome {{context.user.name}}' } // Invalid
```

## Validation System

### Field-Level Validation

```javascript
const field = {
  fieldtype: 'text',
  name: 'Age',
  validations: [
    {
      // Simple validation using JSONata (numbers and boolean logic)
      expression: '[[jsonata]]field_data.age and field_data.age > 0',
      error_message: 'Age must be greater than 0'
    },
    {
      // Another validation using JSONata
      expression: '[[jsonata]]field_data.age and field_data.age < 120',
      error_message: 'Age must be less than 120'
    },
    {
      // Complex validation using JSONata
      expression: '[[jsonata]]$number(field_data.age) >= 18 and $number(field_data.age) <= 65',
      error_message: 'Age must be between 18 and 65'
    }
  ]
};
```

### Cross-Field Validation

```javascript
const field = {
  fieldtype: 'text',
  name: 'Confirm Password',
  dependencies: ['data.password'],
  validations: [
    {
      // Simple equality check using JSONata
      expression: '[[jsonata]]field_data.confirm_password = data.password',
      error_message: 'Passwords must match'
    },
    {
      // More complex validation with JSONata
      expression: '[[jsonata]]$length(field_data.confirm_password) >= 8 and field_data.confirm_password = data.password',
      error_message: 'Password must be at least 8 characters and match'
    }
  ]
};
```

### Form-Level Validation

```svelte
<script>
  let formComponent;
  let formSettings = $state({});
  
  async function handleSubmit() {
    await formComponent.validate();
    
    if (formSettings.validations.is_valid) {
      // Submit form
      console.log('Form data:', formData);
    } else {
      // Show validation errors
      console.log('Validation issues:', formSettings.validations.issues);
    }
  }
</script>
```

## Conditional Logic

### Simple Conditions

Show/hide fields based on other field values:

```javascript
const field = {
  fieldtype: 'text',
  name: 'Other Reason',
  conditions: [
    {
      expression: '[[jsonata]]data.reason = "other"'
    }
  ]
};
```

### Complex Conditions with JSONata

```javascript
const field = {
  fieldtype: 'select',
  name: 'State',
  conditions: [
    {
      // Using JSONata for array membership check
      expression: '[[jsonata]]data.country in ["US", "CA"]'
    }
  ]
};
```

### Data Preservation

Control what happens to field data when conditions fail:

```javascript
const field = {
  fieldtype: 'text',
  name: 'Conditional Field',
  keep_data_on_conditions_failed: true, // Keep data when hidden
  conditions: [
    {
      expression: '[[jsonata]]data.show_field = true'
    }
  ]
};
```

## Nested Fields and Data Structures

### Nested Data Paths

```javascript
const fields = [
  {
    fieldtype: 'text',
    name: 'Street Address',
    data_path: 'address.street'
  },
  {
    fieldtype: 'text',
    name: 'City',
    data_path: 'address.city'
  }
];

// Results in data structure:
// {
//   address: {
//     street: 'value',
//     city: 'value'
//   }
// }
```

### Parent-Child Relationships

```javascript
const fields = [
  {
    fieldtype: 'group',
    name: 'Address',
    field_id: 'address_group',
    data_path: 'address'
  },
  {
    fieldtype: 'text',
    name: 'Street',
    parent_field_id: 'address_group',
    parent_data_path: 'address'
  }
];
```

## Dynamic Settings

Fields can have settings that update when dependencies change:

```javascript
const field = {
  fieldtype: 'select',
  name: 'City',
  dependencies: ['data.country'],
  dynamic_settings: {
    // Must use JSONata prefix for object property access
    options: '[[jsonata]]context.cities[data.country]'
  }
};
```

## Advanced Examples

### Multi-Step Form with Conditional Logic

```svelte
<script>
  import { Form } from 'unaffi-dynamic-forms';
  
  let formData = $state({ step: 1 });
  let context = $state({
    steps: {
      1: 'Personal Info',
      2: 'Contact Info', 
      3: 'Preferences'
    }
  });
  
  const fields = [
    // Step 1 fields
    {
      fieldtype: 'text',
      name: 'First Name',
      conditions: [{ expression: '[[jsonata]]data.step = 1' }],
      validations: [
        {
          expression: '[[jsonata]]field_data.first_name and $length(field_data.first_name) > 0',
          error_message: 'Required'
        }
      ]
    },
    // Step 2 fields  
    {
      fieldtype: 'email',
      name: 'Email',
      conditions: [{ expression: '[[jsonata]]data.step = 2' }],
      dependencies: ['data.first_name'],
      validations: [
        {
          expression: '[[jsonata]]field_data.email and $match(field_data.email, /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/)',
          error_message: 'Invalid email format'
        }
      ]
    }
  ];
</script>

<Form bind:data={formData} {fields} {context} {components} />
```

### Dynamic Field Generation

```svelte
<script>
  let formData = $state({});
  let context = $state({
    questionTypes: ['text', 'number', 'select'],
    questions: [
      { id: 'q1', type: 'text', label: 'What is your name?' },
      { id: 'q2', type: 'number', label: 'What is your age?' }
    ]
  });
  
  const dynamicFields = $derived(context.questions.map(q => ({
    fieldtype: q.type,
    name: q.label,
    data_path: `answers.${q.id}`,
    validations: q.type === 'text' ? [
      {
        expression: `[[jsonata]]field_data.${q.id} and $length(field_data.${q.id}) > 0`,
        error_message: 'This field is required'
      }
    ] : []
  })));
</script>

<Form bind:data={formData} fields={dynamicFields} {context} {components} />
```

### Custom Field Component

```svelte
<!-- CustomTextInput.svelte -->
<script>
  let { field_metadata = $bindable(), field_data = $bindable() } = $props();
  
  const dataKey = $derived(field_metadata?.data_key);
  const value = $derived(field_data?.[dataKey] || '');
  const isValid = $derived(field_metadata?.validations?.is_valid);
  const errorMessage = $derived(field_metadata?.validations?.error_message);
  
  function handleInput(event) {
    if (field_data && dataKey) {
      field_data[dataKey] = event.target.value;
    }
  }
</script>

<div class="field-wrapper">
  <label for={field_metadata?.field_id}>
    {field_metadata?.definition?.name}
  </label>
  
  <input
    id={field_metadata?.field_id}
    type="text"
    {value}
    oninput={handleInput}
    class:error={!isValid}
  />
  
  {#if !isValid && errorMessage}
    <span class="error-message">{errorMessage}</span>
  {/if}
</div>

<style>
  .field-wrapper {
    margin-bottom: 1rem;
  }
  
  .error {
    border-color: red;
  }
  
  .error-message {
    color: red;
    font-size: 0.875rem;
  }
</style>
```

## API Reference

### FormSettings

```typescript
interface FormSettings {
  form_id: string;
  validations: {
    is_show?: boolean;
    is_valid?: boolean;
    max_time?: number;        // Default: 5000ms
    check_interval?: number;  // Default: 100ms
    is_failed?: boolean;
    is_timeout?: boolean;
    issues?: Array<{
      field_id: string;
      error_message?: string;
    }>;
    duration?: number;
  };
}
```

### FieldMetadata

```typescript
interface FieldMetadata {
  field_id: string;
  data_key: string;
  init_value?: any;
  default_value?: any;
  validations: {
    is_valid?: boolean;
    error_message?: string;
    previous_result?: boolean;
    checks?: Array<{
      is_valid: boolean;
      error_message: string;
    }>;
  };
  conditions: {
    is_passed?: boolean;
    previous_result?: boolean;
  };
  dynamic_settings?: any;
  dependencies_changed: boolean;
  definition: FieldDefinition;
}
```

## Best Practices

### Performance Optimization

1. **Minimize Dependencies**: Only declare dependencies that actually affect the field
2. **Use Debouncing**: The library automatically debounces dependency changes (300ms)
3. **Efficient Expressions**: Keep JSONata expressions simple and fast

### Error Handling

```svelte
<script>
  let formData = $state({});
  let formSettings = $state({});
  
  // Monitor for validation timeouts
  $effect(() => {
    if (formSettings.validations?.is_timeout) {
      console.warn('Form validation timed out');
    }
  });
</script>
```

### Testing

```javascript
// Test form validation
import { render } from '@testing-library/svelte';
import Form from './Form.svelte';

test('validates required field', async () => {
  const { component } = render(Form, {
    fields: [{
      fieldtype: 'text',
      name: 'Required Field',
      validations: [
        {
          expression: 'field_data.required_field && field_data.required_field.length > 0',
          error_message: 'This field is required'
        }
      ]
    }]
  });
  
  await component.validate();
  // Assert validation results
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- 📖 [Documentation](https://github.com/UNAFFI/unaffi-dynamic-forms)
- 🐛 [Issue Tracker](https://github.com/UNAFFI/unaffi-dynamic-forms/issues)
- 💬 [Discussions](https://github.com/UNAFFI/unaffi-dynamic-forms/discussions)