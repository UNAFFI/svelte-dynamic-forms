# UNAFFI Dynamic Forms

A powerful Svelte component library for building dynamic, configuration-driven forms with advanced templating, validation, and conditional logic capabilities.

## Features

- 🎯 **Configuration-driven** - Build complex forms using JSON-like field definitions
- 🔄 **Dynamic templating** - Use Mustache and JSONata expressions for reactive content
- ✅ **Advanced validation** - Configurable validation with custom error messages
- 🎛️ **Conditional logic** - Show/hide fields based on other field values
- 🧩 **Swappable components** - Replace any UI component while keeping logic
- 📊 **State management** - Centralized form state with validation tracking
- 🔗 **Template dependencies** - Fields reactively update when dependencies change
- 🎨 **Fully customizable** - Style and behavior control through component swapping

## Installation

```bash
npm install unaffi-dynamic-forms
```

## Quick Start

```svelte
<script>
  import { Form } from 'unaffi-dynamic-forms';
  
  let context = {};
  
  const config = {
    fields: [
      {
        name: 'Full Name',
        fieldtype: 'text',
        validations: [
          {
            expression: '[[jsonata]]$length(data.full_name) > 2',
            error_message: 'Name must be at least 3 characters'
          }
        ]
      },
      {
        name: 'Email',
        fieldtype: 'text',
        placeholder: 'Enter your email address'
      }
    ]
  };
</script>

<Form bind:context {config} />

<!-- Access form data -->
<pre>{JSON.stringify(context.data, null, 2)}</pre>
```

## Field Types

### Text Field

Basic text input with validation and templating support.

```javascript
{
  name: 'Username',
  fieldtype: 'text',
  placeholder: 'Enter username',
  validations: [
    {
      expression: '[[jsonata]]$length(data.username) >= 3',
      error_message: 'Username must be at least 3 characters'
    }
  ]
}
```

### Fieldset

Groups related fields together, useful for organizing form sections.

```javascript
{
  name: 'Personal Information',
  fieldtype: 'fieldset',
  fields: [
    {
      name: 'First Name',
      fieldtype: 'text'
    },
    {
      name: 'Last Name', 
      fieldtype: 'text'
    },
    {
      name: 'Age',
      fieldtype: 'text'
    }
  ]
}
```

### Array Field

Dynamic arrays that allow users to add, remove, and reorder items.

```javascript
{
  name: 'Skills',
  fieldtype: 'array',
  array_item_config: {
    fields: [
      {
        name: 'Skill Name',
        fieldtype: 'text'
      },
      {
        name: 'Years of Experience',
        fieldtype: 'text'
      }
    ]
  }
}
```

### Pages Field

Multi-step forms with navigation between pages.

```javascript
{
  name: 'Registration Wizard',
  fieldtype: 'pages',
  pages: [
    {
      fields: [
        { name: 'Email', fieldtype: 'text' },
        { name: 'Password', fieldtype: 'text' }
      ]
    },
    {
      fields: [
        { name: 'First Name', fieldtype: 'text' },
        { name: 'Last Name', fieldtype: 'text' }
      ]
    }
  ]
}
```

### Heading Field

Display headings and titles within forms.

```javascript
{
  name: 'Section Title',
  fieldtype: 'heading',
  content: 'Personal Information'
}
```

### HTML Field

Display rich HTML content.

```javascript
{
  name: 'Instructions',
  fieldtype: 'html',
  content: '<p>Please fill out all required fields marked with <strong>*</strong></p>'
}
```

### Custom Field

Use your own custom components.

```javascript
{
  name: 'Custom Widget',
  fieldtype: 'custom',
  custom_component_key: 'my_custom_component'
}
```

## Advanced Features

### Template Dependencies

Fields can reactively update based on changes in other fields.

```javascript
{
  name: 'Welcome Message',
  fieldtype: 'heading',
  content: 'Hello {{data.first_name}}!',
  template_dependencies: ['data.first_name']
}
```

### Conditional Logic

Show or hide fields based on conditions.

```javascript
{
  name: 'Company Name',
  fieldtype: 'text',
  conditions: [
    {
      expression: '[[jsonata]]data.employment_status = "employed"'
    }
  ]
},
{
  name: 'Employment Status',
  fieldtype: 'text'
}
```

### JSONata Expressions

Use powerful JSONata expressions for complex logic.

```javascript
{
  name: 'Total Score',
  fieldtype: 'text',
  default: '[[jsonata]]$sum(data.scores)',
  template_dependencies: ['data.scores']
}
```

### Complex Validation

Multi-rule validation with custom error messages.

```javascript
{
  name: 'Password',
  fieldtype: 'text',
  validations: [
    {
      expression: '[[jsonata]]$length(data.password) >= 8',
      error_message: 'Password must be at least 8 characters'
    },
    {
      expression: '[[jsonata]]$contains(data.password, /[A-Z]/)',
      error_message: 'Password must contain at least one uppercase letter'
    },
    {
      expression: '[[jsonata]]$contains(data.password, /[0-9]/)',
      error_message: 'Password must contain at least one number'
    }
  ]
}
```

### Data Path Customization

Control where field data is stored in the context.

```javascript
{
  name: 'User Email',
  fieldtype: 'text',
  data_path: 'user.contact.email'  // Stores in context.data.user.contact.email
}
```

### Default Values

Set default values using templates.

```javascript
{
  name: 'Registration Date',
  fieldtype: 'text',
  default: '[[jsonata]]$now()',
  label: 'Registration Date (auto-filled)'
}
```

### Template Context

Create reusable template variables.

```javascript
{
  name: 'Summary',
  fieldtype: 'heading',
  content: 'Welcome {{fullName}}, your score is {{totalScore}}',
  template_context: {
    fullName: '{{data.first_name}} {{data.last_name}}',
    totalScore: '[[jsonata]]$sum(data.test_scores)'
  },
  template_dependencies: ['data.first_name', 'data.last_name', 'data.test_scores']
}
```

## Form Validation

Validate the entire form programmatically:

```svelte
<script>
  import { Form } from 'unaffi-dynamic-forms';
  
  let formRef;
  let context = {};
  
  async function handleSubmit() {
    const validation = await formRef.validate();
    
    if (validation.is_valid) {
      // Submit form data
      console.log('Form is valid:', context.data);
    } else {
      // Handle validation errors
      console.log('Validation issues:', validation.issues);
    }
  }
</script>

<Form bind:this={formRef} bind:context {config} />
<button on:click={handleSubmit}>Submit</button>
```

## Component Swapping

Customize the appearance and behavior by swapping components:

```svelte
<script>
  import { Form } from 'unaffi-dynamic-forms';
  import CustomTextInput from './CustomTextInput.svelte';
  import CustomButton from './CustomButton.svelte';
  
  const swappableComponents = {
    text: CustomTextInput,
    _label: CustomLabel,
    _validation: CustomValidation
  };
</script>

<Form {config} {swappableComponents} />
```

## API Reference

### Form Component Props

| Prop | Type | Description |
|------|------|-------------|
| `context` | `object` | Bindable form context containing data and state |
| `config` | `object` | Form configuration with fields and options |
| `swappable_components` | `object` | Custom components to replace defaults |

### Form Config Options

| Option | Type | Description |
|--------|------|-------------|
| `fields` | `FieldDefinition[]` | Array of field definitions |
| `show_validation` | `boolean` | Whether to show validation messages |
| `form_id` | `string` | Unique form identifier |

### Field Definition Properties

| Property | Type | Description |
|----------|------|-------------|
| `fieldtype` | `string` | Type of field to render |
| `name` | `string` | Field name (used for label and data path) |
| `data_path` | `string` | Custom path for data storage |
| `label` | `string` | Field label (supports templating) |
| `placeholder` | `string` | Field placeholder (supports templating) |
| `default` | `any` | Default value (supports templating) |
| `validations` | `Validation[]` | Validation rules |
| `conditions` | `Condition[]` | Conditional display rules |
| `template_dependencies` | `string[]` | Paths that trigger re-evaluation |
| `template_context` | `object` | Reusable template variables |
| `fields` | `FieldDefinition[]` | Child fields (for fieldset) |

## Examples

### Registration Form with Conditional Logic

```javascript
const registrationConfig = {
  show_validation: true,
  fields: [
    {
      name: 'Account Type',
      fieldtype: 'text',
      placeholder: 'personal or business'
    },
    {
      name: 'Personal Information',
      fieldtype: 'fieldset',
      conditions: [
        { expression: '[[jsonata]]data.account_type = "personal"' }
      ],
      fields: [
        { name: 'First Name', fieldtype: 'text' },
        { name: 'Last Name', fieldtype: 'text' }
      ]
    },
    {
      name: 'Business Information', 
      fieldtype: 'fieldset',
      conditions: [
        { expression: '[[jsonata]]data.account_type = "business"' }
      ],
      fields: [
        { name: 'Company Name', fieldtype: 'text' },
        { name: 'Tax ID', fieldtype: 'text' }
      ]
    }
  ]
};
```

### Dynamic Survey Form

```javascript
const surveyConfig = {
  fields: [
    {
      name: 'Survey Title',
      fieldtype: 'heading',
      content: 'Customer Satisfaction Survey'
    },
    {
      name: 'Questions',
      fieldtype: 'array',
      array_item_config: {
        fields: [
          {
            name: 'Question',
            fieldtype: 'text',
            placeholder: 'Enter your question'
          },
          {
            name: 'Response',
            fieldtype: 'text',
            placeholder: 'Your answer'
          }
        ]
      }
    },
    {
      name: 'Summary',
      fieldtype: 'html',
      content: 'You have answered {{data.questions.length}} questions',
      template_dependencies: ['data.questions']
    }
  ]
};
```

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## License

MIT License - see LICENSE file for details.