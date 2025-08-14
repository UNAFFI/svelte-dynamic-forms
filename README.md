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
  
  let context = $state({});
  
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
        ],
        template_dependencies: ['data.full_name'] // Required for validation to re-evaluate
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
  ],
  template_dependencies: ['data.username'] // Required for validation to re-evaluate
}
```

### Textarea Field

Multi-line text input field for longer content. Functions exactly like the text field but provides a larger input area.

```javascript
{
  name: 'Description',
  fieldtype: 'textarea',
  placeholder: 'Enter a detailed description...',
  validations: [
    {
      expression: '[[jsonata]]$length(data.description) >= 10',
      error_message: 'Description must be at least 10 characters'
    },
    {
      expression: '[[jsonata]]$length(data.description) <= 500',
      error_message: 'Description must not exceed 500 characters'
    }
  ],
  template_dependencies: ['data.description'] // Required for validation to re-evaluate
}
```

### Select Field

Dropdown selection field with configurable options for single-value selection.

```javascript
{
  name: 'Country',
  fieldtype: 'select',
  placeholder: 'Choose your country',
  options: [
    {
      label: 'United States',
      value: 'us'
    },
    {
      label: 'Canada', 
      value: 'ca'
    },
    {
      label: 'United Kingdom',
      value: 'uk'
    }
  ],
  validations: [
    {
      expression: '[[jsonata]]$exists(data.country)',
      error_message: 'Please select a country'
    }
  ],
  template_dependencies: ['data.country'] // Required for validation to re-evaluate
}
```

#### Dynamic Options

Options can be generated dynamically using templates:

```javascript
{
  name: 'Department',
  fieldtype: 'select',
  options: '[[jsonata]]data.departments.{ "label": name, "value": id }',
  template_dependencies: ['data.departments']
}
```

#### Select Options Structure

Each option in the `options` array must have:

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Display text shown to users |
| `value` | `string` | Internal value stored in form data |

#### Select Field Data Storage

The select field stores two values in the form data:
- `[field_name]`: The selected option's `value`
- `[field_name]_label`: The selected option's `label` (for display purposes)

```javascript
// Example: If field name is "country" and user selects "United States"
context.data = {
  country: 'us',           // The value
  country_label: 'United States'  // The label
}
```

#### Advanced Select Examples

**Conditional options based on other fields:**
```javascript
{
  name: 'State',
  fieldtype: 'select',
  options: '[[jsonata]]data.country = "us" ? states_us : data.country = "ca" ? states_ca : []',
  conditions: [
    {
      expression: '[[jsonata]]data.country in ["us", "ca"]'
    }
  ],
  template_dependencies: ['data.country']
}
```

**Select with validation:**
```javascript
{
  name: 'Priority Level',
  fieldtype: 'select',
  options: [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Critical', value: 'critical' }
  ],
  validations: [
    {
      expression: '[[jsonata]]$exists(data.priority_level)',
      error_message: 'Priority level is required'
    },
    {
      expression: '[[jsonata]]data.issue_type = "bug" ? data.priority_level in ["high", "critical"] : true',
      error_message: 'Bug reports must have high or critical priority'
    }
  ],
  template_dependencies: ['data.priority_level', 'data.issue_type']
}
```

### MultiSelect Field

Multi-selection field that allows users to select multiple options from a list. Stores selected values as an array of objects.

```javascript
{
  name: 'Skills',
  fieldtype: 'multiselect',
  placeholder: 'Select your skills',
  options: [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C#', value: 'csharp' },
    { label: 'Go', value: 'go' },
    { label: 'TypeScript', value: 'typescript' }
  ],
  validations: [
    {
      expression: '[[jsonata]]$count(data.skills) >= 1',
      error_message: 'Please select at least one skill'
    },
    {
      expression: '[[jsonata]]$count(data.skills) <= 5',
      error_message: 'Please select no more than 5 skills'
    }
  ],
  template_dependencies: ['data.skills']
}
```

#### MultiSelect Options Structure

Each option in the `options` array must have:

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Display text shown to users |
| `value` | `string` | Internal value stored in form data |

#### MultiSelect Field Data Storage

The multiselect field stores selected values as an array of objects:

```javascript
// Example: If field name is "skills" and user selects "JavaScript" and "Python"
context.data = {
  skills: [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' }
  ]
}
```

#### Advanced MultiSelect Examples

**Required selections with limits:**
```javascript
{
  name: 'Required Tags',
  fieldtype: 'multiselect',
  placeholder: 'Select tags (1-3 required)',
  options: [
    { label: 'Urgent', value: 'urgent' },
    { label: 'Important', value: 'important' },
    { label: 'Bug Fix', value: 'bugfix' },
    { label: 'Feature', value: 'feature' },
    { label: 'Documentation', value: 'docs' }
  ],
  validations: [
    {
      expression: '[[jsonata]]$count(data.required_tags) >= 1',
      error_message: 'At least one tag is required'
    },
    {
      expression: '[[jsonata]]$count(data.required_tags) <= 3',
      error_message: 'Maximum 3 tags allowed'
    }
  ],
  template_dependencies: ['data.required_tags']
}
```

**Dynamic options based on other fields:**
```javascript
{
  name: 'Available Features',
  fieldtype: 'multiselect',
  placeholder: 'Select features to enable',
  options: '[[jsonata]]data.subscription_type = "premium" ? premium_features : data.subscription_type = "basic" ? basic_features : []',
  conditions: [
    {
      expression: '[[jsonata]]$exists(data.subscription_type)'
    }
  ],
  template_dependencies: ['data.subscription_type', 'premium_features', 'basic_features']
}
```

**MultiSelect with conditional validation:**
```javascript
{
  name: 'Technologies',
  fieldtype: 'multiselect',
  placeholder: 'Select technologies you\'ll use',
  options: [
    { label: 'Frontend Framework', value: 'frontend' },
    { label: 'Backend Framework', value: 'backend' },
    { label: 'Database', value: 'database' },
    { label: 'Cloud Platform', value: 'cloud' },
    { label: 'Testing Framework', value: 'testing' }
  ],
  validations: [
    {
      expression: '[[jsonata]]$count(data.technologies) >= 2',
      error_message: 'Please select at least 2 technologies'
    },
    {
      expression: '[[jsonata]]data.project_type = "fullstack" ? ("frontend" in data.technologies.value and "backend" in data.technologies.value) : true',
      error_message: 'Full-stack projects must include both frontend and backend technologies'
    }
  ],
  template_dependencies: ['data.technologies', 'data.project_type']
}
```

**MultiSelect with summary display:**
```javascript
{
  name: 'Selected Skills Summary',
  fieldtype: 'html',
  content: '[[jsonata]]$count(data.skills) > 0 ? "<p>You have selected <strong>" & $count(data.skills) & "</strong> skills: " & $join(data.skills.label, ", ") & "</p>" : "<p>No skills selected yet.</p>"',
  conditions: [
    {
      expression: '[[jsonata]]$exists(data.skills)'
    }
  ],
  template_dependencies: ['data.skills']
}
```

### Radio Field

Single-selection field that allows users to choose one option from a list using radio buttons. Functions exactly like the select field but displays options as radio buttons.

```javascript
{
  name: 'Priority Level',
  fieldtype: 'radio',
  options: [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Critical', value: 'critical' }
  ],
  validations: [
    {
      expression: '[[jsonata]]$exists(data.priority_level)',
      error_message: 'Please select a priority level'
    }
  ],
  template_dependencies: ['data.priority_level']
}
```

#### Radio Options Structure

Each option in the `options` array must have:

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Display text shown to users |
| `value` | `string` | Internal value stored in form data |

#### Radio Field Data Storage

The radio field stores data exactly like the select field:
- `[field_name]`: The selected option's `value`
- `[field_name]_label`: The selected option's `label` (for display purposes)

```javascript
// Example: If field name is "priority_level" and user selects "High"
context.data = {
  priority_level: 'high',           // The value
  priority_level_label: 'High'     // The label
}
```

#### Advanced Radio Examples

**Dynamic options based on other fields:**
```javascript
{
  name: 'Shipping Method',
  fieldtype: 'radio',
  options: '[[jsonata]]data.location = "domestic" ? domestic_shipping : data.location = "international" ? international_shipping : []',
  conditions: [
    {
      expression: '[[jsonata]]$exists(data.location)'
    }
  ],
  template_dependencies: ['data.location']
}
```

**Radio with conditional validation:**
```javascript
{
  name: 'Payment Method',
  fieldtype: 'radio',
  options: [
    { label: 'Credit Card', value: 'credit' },
    { label: 'PayPal', value: 'paypal' },
    { label: 'Bank Transfer', value: 'bank' },
    { label: 'Cash on Delivery', value: 'cod' }
  ],
  validations: [
    {
      expression: '[[jsonata]]$exists(data.payment_method)',
      error_message: 'Please select a payment method'
    },
    {
      expression: '[[jsonata]]data.order_total > 100 ? data.payment_method != "cod" : true',
      error_message: 'Cash on delivery is not available for orders over $100'
    }
  ],
  template_dependencies: ['data.payment_method', 'data.order_total']
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

Repeatable field groups for collecting multiple sets of the same data structure.

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

### Understanding Template Dependencies

**Critical**: Template dependencies determine when validations, conditions, labels, placeholders, and content are re-evaluated. 

- **For validations**: If your validation expression references `data.password`, you must include `'data.password'` in `template_dependencies`
- **For conditions**: If your condition references `data.account_type`, you must include `'data.account_type'` in `template_dependencies`  
- **For templated content**: If your label/placeholder/content references any data, include those paths in `template_dependencies`

**Without proper template dependencies, your validations and conditions will only evaluate once and won't update when the referenced data changes.**

```javascript
// ❌ WRONG - validation won't re-evaluate when username changes
{
  name: 'Username',
  fieldtype: 'text',
  validations: [
    {
      expression: '[[jsonata]]$length(data.username) >= 3',
      error_message: 'Username must be at least 3 characters'
    }
  ]
  // Missing template_dependencies!
}

// ✅ CORRECT - validation re-evaluates when username changes
{
  name: 'Username',
  fieldtype: 'text',
  validations: [
    {
      expression: '[[jsonata]]$length(data.username) >= 3',
      error_message: 'Username must be at least 3 characters'
    }
  ],
  template_dependencies: ['data.username'] // Now validation is reactive!
}
```

### Conditional Logic

Show or hide fields based on conditions. **Important**: Always include referenced data paths in `template_dependencies` so conditions re-evaluate when those values change.

```javascript
{
  name: 'Company Name',
  fieldtype: 'text',
  conditions: [
    {
      expression: '[[jsonata]]data.employment_status = "employed"'
    }
  ],
  template_dependencies: ['data.employment_status'] // Required for condition to re-evaluate
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

Multi-rule validation with custom error messages. **Important**: Include data paths referenced in validation expressions in `template_dependencies`.

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
  ],
  template_dependencies: ['data.password'] // Required for validations to re-evaluate
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
  let context = $state({});
  
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
| `options` | `Option[]` or `string` | Options for select fields (supports templating) |
| `validations` | `Validation[]` | Validation rules |
| `conditions` | `Condition[]` | Conditional display rules |
| `template_dependencies` | `string[]` | **Required** when using validations/conditions - Paths that trigger re-evaluation |
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
      fieldtype: 'select',
      placeholder: 'Choose account type',
      options: [
        { label: 'Personal Account', value: 'personal' },
        { label: 'Business Account', value: 'business' }
      ],
      validations: [
        {
          expression: '[[jsonata]]$exists(data.account_type)',
          error_message: 'Please select an account type'
        }
      ],
      template_dependencies: ['data.account_type']
    },
    {
      name: 'Personal Information',
      fieldtype: 'fieldset',
      conditions: [
        { expression: '[[jsonata]]data.account_type = "personal"' }
      ],
      template_dependencies: ['data.account_type'], // Required for condition to re-evaluate
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
      template_dependencies: ['data.account_type'], // Required for condition to re-evaluate
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

### Advanced Select Field Examples

```javascript
const advancedSelectConfig = {
  fields: [
    {
      name: 'Product Category',
      fieldtype: 'select',
      placeholder: 'Choose a category',
      options: [
        { label: 'Electronics', value: 'electronics' },
        { label: 'Clothing', value: 'clothing' },
        { label: 'Home & Garden', value: 'home_garden' },
        { label: 'Books', value: 'books' }
      ],
      validations: [
        {
          expression: '[[jsonata]]$exists(data.product_category)',
          error_message: 'Product category is required'
        }
      ],
      template_dependencies: ['data.product_category']
    },
    {
      name: 'Subcategory',
      fieldtype: 'select',
      placeholder: 'Choose a subcategory',
      // Dynamic options based on selected category
      options: '[[jsonata]]data.product_category = "electronics" ? [{"label": "Laptops", "value": "laptops"}, {"label": "Smartphones", "value": "smartphones"}, {"label": "Tablets", "value": "tablets"}] : data.product_category = "clothing" ? [{"label": "Men\'s Clothing", "value": "mens"}, {"label": "Women\'s Clothing", "value": "womens"}, {"label": "Kids\' Clothing", "value": "kids"}] : data.product_category = "home_garden" ? [{"label": "Furniture", "value": "furniture"}, {"label": "Decor", "value": "decor"}, {"label": "Tools", "value": "tools"}] : []',
      conditions: [
        {
          expression: '[[jsonata]]$exists(data.product_category)'
        }
      ],
      template_dependencies: ['data.product_category'],
      validations: [
        {
          expression: '[[jsonata]]$exists(data.subcategory)',
          error_message: 'Please select a subcategory'
        }
      ]
    },
    {
      name: 'Product Summary',
      fieldtype: 'html',
      content: '<p>Selected: <strong>{{data.product_category_label}} > {{data.subcategory_label}}</strong></p>',
      conditions: [
        {
          expression: '[[jsonata]]$exists(data.product_category) and $exists(data.subcategory)'
        }
      ],
      template_dependencies: ['data.product_category_label', 'data.subcategory_label']
    },
    {
      name: 'Priority',
      fieldtype: 'select',
      placeholder: 'Select priority',
      options: [
        { label: '🔴 High Priority', value: 'high' },
        { label: '🟡 Medium Priority', value: 'medium' },
        { label: '🟢 Low Priority', value: 'low' }
      ],
      default: 'medium', // Default selection
      validations: [
        {
          expression: '[[jsonata]]data.priority in ["high", "medium", "low"]',
          error_message: 'Please select a valid priority level'
        }
      ],
      template_dependencies: ['data.priority']
    },
    {
      name: 'Team Members',
      fieldtype: 'select',
      placeholder: 'Assign team members',
      // Options from external data source
      options: '[[jsonata]]team_members.{ "label": name & " (" & role & ")", "value": id }',
      template_dependencies: ['team_members'],
      validations: [
        {
          expression: '[[jsonata]]$exists(data.team_members)',
          error_message: 'Please assign at least one team member'
        }
      ]
    }
  ]
};
```

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## License

MIT License - see LICENSE file for details.