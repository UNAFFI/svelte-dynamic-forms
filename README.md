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

### Number Field

Numeric input field that allows both whole numbers and decimals. Perfect for prices, quantities, ages, ratings, and any numeric data.

```javascript
{
  name: 'Age',
  fieldtype: 'number',
  placeholder: 'Enter your age',
  validations: [
    {
      expression: '[[jsonata]]$exists(data.age)',
      error_message: 'Please enter your age'
    },
    {
      expression: '[[jsonata]]$number(data.age) >= 18',
      error_message: 'You must be at least 18 years old'
    }
  ],
  template_dependencies: ['data.age'] // Required for validation to re-evaluate
}
```

#### Advanced Number Examples

**Price validation with decimal precision:**
```javascript
{
  name: 'Product Price',
  fieldtype: 'number',
  label: 'Price (USD)',
  placeholder: 'Enter price',
  validations: [
    {
      expression: '[[jsonata]]$number(data.product_price) > 0',
      error_message: 'Price must be greater than $0'
    },
    {
      expression: '[[jsonata]]$number(data.product_price) <= 10000',
      error_message: 'Maximum price is $10,000'
    },
    {
      expression: '[[jsonata]]$string($number(data.product_price)) ~> /^\d+(\.\d{1,2})?$/',
      error_message: 'Price can have at most 2 decimal places'
    }
  ],
  template_dependencies: ['data.product_price']
}
```

**Budget calculator with dependent validation:**
```javascript
{
  name: 'Monthly Expenses',
  fieldtype: 'number',
  label: 'Monthly expenses',
  validations: [
    {
      expression: '[[jsonata]]$exists(data.monthly_income) ? $number(data.monthly_expenses) <= $number(data.monthly_income) : true',
      error_message: 'Expenses cannot exceed your monthly income'
    }
  ],
  template_dependencies: ['data.monthly_income', 'data.monthly_expenses']
}
```

**Rating system with range validation:**
```javascript
{
  name: 'Rating',
  fieldtype: 'number',
  label: 'Product rating (0.0 - 5.0)',
  placeholder: 'Enter rating',
  validations: [
    {
      expression: '[[jsonata]]$number(data.rating) >= 0 and $number(data.rating) <= 5',
      error_message: 'Rating must be between 0.0 and 5.0'
    }
  ],
  template_dependencies: ['data.rating']
}
```

### Checkbox Field

Single checkbox field that allows you to define custom values for checked and unchecked states. Perfect for boolean toggles, feature flags, agreements, and binary choices with custom data values.

```javascript
{
  name: 'Agree to Terms',
  fieldtype: 'checkbox',
  label: 'I agree to the terms and conditions',
  checked_value: true,
  unchecked_value: false,
  validations: [
    {
      expression: '[[jsonata]]data.agree_to_terms = true',
      error_message: 'You must agree to the terms to continue'
    }
  ],
  template_dependencies: ['data.agree_to_terms']
}
```

#### Advanced Checkbox Examples

**Custom string values for business logic:**
```javascript
{
  name: 'Account Type',
  fieldtype: 'checkbox',
  label: 'Business account (additional features)',
  checked_value: 'business',
  unchecked_value: 'personal',
  validations: [
    {
      expression: '[[jsonata]]data.account_type in ["business", "personal"]',
      error_message: 'Please select an account type'
    }
  ],
  template_dependencies: ['data.account_type']
}
```

**Numeric values for pricing calculations:**
```javascript
{
  name: 'Premium Features',
  fieldtype: 'checkbox',
  label: 'Add premium features (+$15/month)',
  checked_value: 15,
  unchecked_value: 0,
  template_dependencies: ['data.premium_features']
}
```

**Conditional validation based on other fields:**
```javascript
{
  name: 'Email Notifications',
  fieldtype: 'checkbox',
  label: 'Enable email notifications',
  checked_value: 'enabled',
  unchecked_value: 'disabled',
  validations: [
    {
      expression: '[[jsonata]]data.account_type = "business" ? data.email_notifications = "enabled" : true',
      error_message: 'Business accounts must enable email notifications'
    }
  ],
  template_dependencies: ['data.account_type', 'data.email_notifications']
}
```

### Select Field
```

### Checkboxes Field

Multiple selection field using checkboxes for selecting several options from a list. Functions exactly like the multiselect field but displays options as individual checkboxes.

```javascript
{
  name: 'Skills',
  fieldtype: 'checkboxes',
  options: [
    {
      label: 'JavaScript',
      value: 'javascript'
    },
    {
      label: 'Python',
      value: 'python'
    },
    {
      label: 'React',
      value: 'react'
    },
    {
      label: 'Node.js',
      value: 'nodejs'
    }
  ],
  validations: [
    {
      expression: '[[jsonata]]$count(data.skills) >= 1',
      error_message: 'Please select at least one skill'
    },
    {
      expression: '[[jsonata]]$count(data.skills) <= 3',
      error_message: 'Please select no more than 3 skills'
    }
  ],
  template_dependencies: ['data.skills'] // Required for validation to re-evaluate
}
```

#### Advanced Checkboxes Examples

**Dynamic options based on user role:**
```javascript
{
  name: 'Available Features',
  fieldtype: 'checkboxes',
  options: '[[jsonata]]data.user_role = "admin" ? admin_features : data.user_role = "user" ? user_features : basic_features',
  conditions: [
    {
      expression: '[[jsonata]]$exists(data.user_role)'
    }
  ],
  template_dependencies: ['data.user_role']
}
```

**Checkboxes with conditional requirements:**
```javascript
{
  name: 'Required Certifications',
  fieldtype: 'checkboxes',
  options: [
    { label: 'AWS Certified', value: 'aws' },
    { label: 'Azure Certified', value: 'azure' },
    { label: 'GCP Certified', value: 'gcp' },
    { label: 'Kubernetes Certified', value: 'k8s' }
  ],
  validations: [
    {
      expression: '[[jsonata]]data.job_level = "senior" ? $count(data.required_certifications) >= 2 : true',
      error_message: 'Senior positions require at least 2 certifications'
    }
  ],
  template_dependencies: ['data.required_certifications', 'data.job_level']
}
```

### Date Field

Date selection field that allows users to pick dates using the browser's native date picker. Functions similarly to the text field but specifically for date input.

```javascript
{
  name: 'Birth Date',
  fieldtype: 'date',
  label: 'When were you born?',
  validations: [
    {
      expression: '[[jsonata]]$exists(data.birth_date)',
      error_message: 'Please select your birth date'
    },
    {
      expression: '[[jsonata]]$millis() - $toMillis(data.birth_date) >= (18 * 365.25 * 24 * 60 * 60 * 1000)',
      error_message: 'You must be at least 18 years old'
    }
  ],
  template_dependencies: ['data.birth_date'] // Required for validation to re-evaluate
}
```

#### Advanced Date Examples

**Future date validation:**
```javascript
{
  name: 'Event Date',
  fieldtype: 'date',
  label: 'Event date (must be in the future)',
  validations: [
    {
      expression: '[[jsonata]]$toMillis(data.event_date) > $millis()',
      error_message: 'Event date must be in the future'
    }
  ],
  template_dependencies: ['data.event_date']
}
```

**Dynamic default date (one week from now):**
```javascript
{
  name: 'Appointment Date',
  fieldtype: 'date',
  label: 'Preferred appointment date',
  default: '[[jsonata]]$fromMillis($millis() + (7 * 24 * 60 * 60 * 1000), "[Y0001]-[M01]-[D01]")'
}
```

**Date range validation:**
```javascript
{
  name: 'Project Deadline',
  fieldtype: 'date',
  label: 'Project deadline',
  validations: [
    {
      expression: '[[jsonata]]$toMillis(data.project_deadline) >= $toMillis(data.project_start_date)',
      error_message: 'Deadline must be after the start date'
    },
    {
      expression: '[[jsonata]]$toMillis(data.project_deadline) <= $millis() + (365 * 24 * 60 * 60 * 1000)',
      error_message: 'Deadline cannot be more than one year from now'
    }
  ],
  template_dependencies: ['data.project_deadline', 'data.project_start_date']
}
```

### Datetime Field

Date and time selection field that allows users to pick both date and time using the browser's native datetime picker. Functions similarly to the date field but includes time selection.

```javascript
{
  name: 'Appointment Time',
  fieldtype: 'datetime',
  label: 'When would you like to schedule your appointment?',
  validations: [
    {
      expression: '[[jsonata]]$exists(data.appointment_time)',
      error_message: 'Please select an appointment time'
    },
    {
      expression: '[[jsonata]]$toMillis(data.appointment_time & ":00.000Z") > $millis()',
      error_message: 'Appointment time must be in the future'
    }
  ],
  template_dependencies: ['data.appointment_time'] // Required for validation to re-evaluate
}
```

#### Advanced Datetime Examples

**Business hours validation:**
```javascript
{
  name: 'Appointment Time',
  fieldtype: 'datetime',
  label: 'Appointment time (business hours: 9 AM - 5 PM, Mon-Fri)',
  validations: [
    {
      expression: '[[jsonata]]$formatDateTime($toMillis(data.appointment_time & ":00.000Z"), "[F1]") in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]',
      error_message: 'Appointments are only available Monday through Friday'
    },
    {
      expression: '[[jsonata]]$number($formatDateTime($toMillis(data.appointment_time & ":00.000Z"), "[H01]")) >= 9 and $number($formatDateTime($toMillis(data.appointment_time & ":00.000Z"), "[H01]")) < 17',
      error_message: 'Appointments are only available between 9 AM and 5 PM'
    }
  ],
  template_dependencies: ['data.appointment_time']
}
```

**Date range with time validation:**
```javascript
{
  name: 'Conference End Time',
  fieldtype: 'datetime',
  label: 'Conference end time',
  validations: [
    {
      expression: '[[jsonata]]$toMillis(data.conference_end_time & ":00.000Z") > $toMillis(data.conference_start_time & ":00.000Z")',
      error_message: 'End time must be after start time'
    },
    {
      expression: '[[jsonata]]$toMillis(data.conference_end_time & ":00.000Z") - $toMillis(data.conference_start_time & ":00.000Z") <= (8 * 60 * 60 * 1000)',
      error_message: 'Conference cannot be longer than 8 hours'
    }
  ],
  template_dependencies: ['data.conference_end_time', 'data.conference_start_time']
}
```

### Time Field

Time selection field that allows users to pick a time using the browser's native time picker. Useful for scheduling, business hours, deadlines, and any time-specific configurations.

```javascript
{
  name: 'Meeting Time',
  fieldtype: 'time',
  label: 'What time should we meet?',
  validations: [
    {
      expression: '[[jsonata]]$exists(data.meeting_time)',
      error_message: 'Please select a meeting time'
    }
  ],
  template_dependencies: ['data.meeting_time']
}
```

#### Advanced Time Examples

**Business hours validation:**
```javascript
{
  name: 'Office Hours Start',
  fieldtype: 'time',
  label: 'Office opening time',
  validations: [
    {
      expression: '[[jsonata]]$toMillis("1970-01-01T" & data.office_start & ":00.000Z") >= $toMillis("1970-01-01T08:00:00.000Z")',
      error_message: 'Office must open at or after 8:00 AM'
    },
    {
      expression: '[[jsonata]]$toMillis("1970-01-01T" & data.office_start & ":00.000Z") <= $toMillis("1970-01-01T10:00:00.000Z")',
      error_message: 'Office must open by 10:00 AM'
    }
  ],
  template_dependencies: ['data.office_start']
}
```

**Time range validation:**
```javascript
{
  name: 'End Time',
  fieldtype: 'time',
  label: 'Event end time',
  validations: [
    {
      expression: '[[jsonata]]$exists(data.start_time) ? $toMillis("1970-01-01T" & data.end_time & ":00.000Z") > $toMillis("1970-01-01T" & data.start_time & ":00.000Z") : true',
      error_message: 'End time must be after start time'
    },
    {
      expression: '[[jsonata]]$toMillis("1970-01-01T" & data.end_time & ":00.000Z") - $toMillis("1970-01-01T" & data.start_time & ":00.000Z") <= (4 * 60 * 60 * 1000)',
      error_message: 'Event cannot be longer than 4 hours'
    }
  ],
  template_dependencies: ['data.start_time', 'data.end_time']
}
```

**Conditional time selection:**
```javascript
{
  name: 'Reminder Time',
  fieldtype: 'time',
  label: 'When should we remind you?',
  conditions: [
    {
      expression: '[[jsonata]]data.enable_reminders = true'
    }
  ],
  validations: [
    {
      expression: '[[jsonata]]$toMillis("1970-01-01T" & data.reminder_time & ":00.000Z") >= $toMillis("1970-01-01T06:00:00.000Z")',
      error_message: 'Reminders cannot be set before 6:00 AM'
    },
    {
      expression: '[[jsonata]]$toMillis("1970-01-01T" & data.reminder_time & ":00.000Z") <= $toMillis("1970-01-01T22:00:00.000Z")',
      error_message: 'Reminders cannot be set after 10:00 PM'
    }
  ],
  template_dependencies: ['data.enable_reminders', 'data.reminder_time']
}
```

**Dynamic default datetime (24 hours from now):**
```javascript
{
  name: 'Reminder Time',
  fieldtype: 'datetime',
  label: 'Set reminder time',
  default: '[[jsonata]]$fromMillis($millis() + (24 * 60 * 60 * 1000), "[Y0001]-[M01]-[D01]T[H01]:[m01]")'
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

### JSON Field

Structured data field that allows users to edit and store complex JSON objects. Perfect for configuration files, API requests, metadata, and any structured data that needs to be stored as JSON.

```javascript
{
  name: 'API Configuration',
  fieldtype: 'json',
  label: 'Configure API settings',
  validations: [
    {
      expression: '[[jsonata]]$exists(data.api_configuration)',
      error_message: 'API configuration is required'
    },
    {
      expression: '[[jsonata]]$exists(data.api_configuration.endpoint)',
      error_message: 'API endpoint must be specified'
    }
  ],
  template_dependencies: ['data.api_configuration']
}
```

#### JSON Field Data Handling

- **Object Storage**: Stores and retrieves complex JavaScript objects
- **Nested Validation**: Validate nested properties and array elements using JSONata
- **Type Checking**: Ensure specific data types for object properties
- **Default Objects**: Set complex default structures using JSONata expressions
- **Conditional Logic**: Show/hide based on object properties or structure
- **Template Integration**: Use object properties in other field templates

#### Advanced JSON Examples

**Configuration object validation:**
```javascript
{
  name: 'Database Configuration',
  fieldtype: 'json',
  label: 'Database connection settings',
  default: {
    host: "localhost",
    port: 5432,
    database: "myapp",
    ssl: false
  },
  validations: [
    {
      expression: '[[jsonata]]$exists(data.database_configuration.host)',
      error_message: 'Database host is required'
    },
    {
      expression: '[[jsonata]]$exists(data.database_configuration.port)',
      error_message: 'Database port is required'
    },
    {
      expression: '[[jsonata]]$number(data.database_configuration.port) > 0 and $number(data.database_configuration.port) <= 65535',
      error_message: 'Database port must be between 1 and 65535'
    }
  ],
  template_dependencies: ['data.database_configuration']
}
```

**API request data structure:**
```javascript
{
  name: 'Request Body',
  fieldtype: 'json',
  label: 'HTTP request body (JSON)',
  validations: [
    {
      expression: '[[jsonata]]data.request_method in ["POST", "PUT", "PATCH"] ? $exists(data.request_body) : true',
      error_message: 'Request body is required for POST, PUT, and PATCH requests'
    },
    {
      expression: '[[jsonata]]$type(data.request_body) = "object"',
      error_message: 'Request body must be a valid JSON object'
    }
  ],
  template_dependencies: ['data.request_method', 'data.request_body']
}
```

**Nested object validation:**
```javascript
{
  name: 'User Preferences',
  fieldtype: 'json',
  label: 'User preferences object',
  default: {
    theme: "light",
    notifications: {
      email: true,
      push: false
    },
    language: "en"
  },
  validations: [
    {
      expression: '[[jsonata]]$exists(data.user_preferences.theme)',
      error_message: 'Theme preference is required'
    },
    {
      expression: '[[jsonata]]data.user_preferences.theme in ["light", "dark", "auto"]',
      error_message: 'Theme must be light, dark, or auto'
    },
    {
      expression: '[[jsonata]]$exists(data.user_preferences.language)',
      error_message: 'Language preference is required'
    },
    {
      expression: '[[jsonata]]$type(data.user_preferences.notifications) = "object"',
      error_message: 'Notifications must be an object'
    }
  ],
  template_dependencies: ['data.user_preferences']
}
```

**Conditional object structure:**
```javascript
{
  name: 'Advanced Settings',
  fieldtype: 'json',
  label: 'Advanced configuration object',
  conditions: [
    {
      expression: '[[jsonata]]data.enable_advanced_mode = true'
    }
  ],
  default: {
    debug: false,
    logLevel: "info",
    maxRetries: 3
  },
  validations: [
    {
      expression: '[[jsonata]]$type(data.advanced_settings) = "object"',
      error_message: 'Advanced settings must be a valid object'
    },
    {
      expression: '[[jsonata]]$exists(data.advanced_settings.logLevel) ? data.advanced_settings.logLevel in ["debug", "info", "warn", "error"] : true',
      error_message: 'Log level must be debug, info, warn, or error'
    }
  ],
  template_dependencies: ['data.enable_advanced_mode', 'data.advanced_settings']
}
```

**Array validation within JSON:**
```javascript
{
  name: 'Form Schema',
  fieldtype: 'json',
  label: 'Form structure definition',
  validations: [
    {
      expression: '[[jsonata]]$exists(data.form_schema.fields)',
      error_message: 'Form schema must include a fields array'
    },
    {
      expression: '[[jsonata]]$type(data.form_schema.fields) = "array"',
      error_message: 'Fields must be an array'
    },
    {
      expression: '[[jsonata]]$count(data.form_schema.fields) > 0',
      error_message: 'At least one field must be defined'
    },
    {
      expression: '[[jsonata]]$all(data.form_schema.fields, function($field) { $exists($field.fieldtype) })',
      error_message: 'All fields must have a fieldtype property'
    }
  ],
  template_dependencies: ['data.form_schema']
}
```

#### JSON Field Data Storage

The JSON field stores the parsed JSON object directly in the form data:

```javascript
// Example: If field name is "api_configuration" and user enters JSON
context.data = {
  api_configuration: {
    endpoint: "https://api.example.com",
    timeout: 5000,
    retries: 3,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer token"
    }
  }
}
```

### Tel Field

Telephone input field with international country selection and automatic phone number formatting. Perfect for collecting phone numbers, mobile numbers, and contact information with proper validation and formatting.

```javascript
{
  name: 'Phone Number',
  fieldtype: 'tel',
  label: 'Enter your phone number',
  placeholder: 'Select country and enter number',
  validations: [
    {
      expression: '[[jsonata]]$exists(data.phone_number)',
      error_message: 'Phone number is required'
    },
    {
      expression: '[[jsonata]]$length($trim(data.phone_number)) >= 10',
      error_message: 'Please enter a valid phone number'
    }
  ],
  template_dependencies: ['data.phone_number']
}
```

#### Tel Field Features

- **Country Selection**: Dropdown to select country with flag display
- **Auto-formatting**: Phone numbers are automatically formatted according to the selected country's format
- **International Support**: Supports phone number formats for all countries
- **Real-time Validation**: Format validation as user types
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Consistent Styling**: Matches Material Design standards of other form components

#### Advanced Tel Examples

**Required phone number with format validation:**
```javascript
{
  name: 'Mobile Number',
  fieldtype: 'tel',
  label: 'Mobile number (required)',
  placeholder: 'Enter your mobile number',
  validations: [
    {
      expression: '[[jsonata]]$exists(data.mobile_number)',
      error_message: 'Mobile number is required'
    },
    {
      expression: '[[jsonata]]$substring(data.mobile_number, 0, 1) = "+"',
      error_message: 'Please include country code'
    },
    {
      expression: '[[jsonata]]$length($replace(data.mobile_number, /[^0-9]/g, "")) >= 7',
      error_message: 'Phone number must have at least 7 digits'
    }
  ],
  template_dependencies: ['data.mobile_number']
}
```

**Multiple phone numbers with different validation:**
```javascript
{
  name: 'Contact Information',
  fieldtype: 'fieldset',
  fields: [
    {
      name: 'Primary Phone',
      fieldtype: 'tel',
      label: 'Primary phone number',
      placeholder: 'Your main phone number',
      validations: [
        {
          expression: '[[jsonata]]$exists(data.primary_phone)',
          error_message: 'Primary phone number is required'
        }
      ],
      template_dependencies: ['data.primary_phone']
    },
    {
      name: 'Emergency Contact',
      fieldtype: 'tel',
      label: 'Emergency contact number',
      placeholder: 'Emergency contact phone',
      validations: [
        {
          expression: '[[jsonata]]$exists(data.emergency_contact)',
          error_message: 'Emergency contact is required'
        },
        {
          expression: '[[jsonata]]data.emergency_contact != data.primary_phone',
          error_message: 'Emergency contact must be different from primary phone'
        }
      ],
      template_dependencies: ['data.emergency_contact', 'data.primary_phone']
    }
  ]
}
```

**Conditional phone number based on contact preference:**
```javascript
{
  name: 'Contact Method',
  fieldtype: 'select',
  options: [
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
    { label: 'SMS', value: 'sms' }
  ]
},
{
  name: 'Phone Number',
  fieldtype: 'tel',
  label: 'Your phone number',
  placeholder: 'Enter phone number',
  conditions: [
    {
      expression: '[[jsonata]]data.contact_method in ["phone", "sms"]'
    }
  ],
  validations: [
    {
      expression: '[[jsonata]]data.contact_method in ["phone", "sms"] ? $exists(data.phone_number) : true',
      error_message: 'Phone number is required for phone/SMS contact'
    }
  ],
  template_dependencies: ['data.contact_method', 'data.phone_number']
}
```

**Business hours phone with custom validation:**
```javascript
{
  name: 'Business Phone',
  fieldtype: 'tel',
  label: 'Business phone number',
  placeholder: 'Business contact number',
  validations: [
    {
      expression: '[[jsonata]]$exists(data.business_phone)',
      error_message: 'Business phone number is required'
    },
    {
      expression: '[[jsonata]]$not($contains(data.business_phone, "mobile")) or $length($replace(data.business_phone, /[^0-9]/g, "")) >= 10',
      error_message: 'Please enter a valid business phone number'
    }
  ],
  template_dependencies: ['data.business_phone']
}
```

#### Tel Field Data Storage

The tel field stores the formatted phone number as a string in international format:

```javascript
// Example: If field name is "phone_number" and user enters a US number
context.data = {
  phone_number: "+1 (555) 123-4567"  // Formatted international number
}
```

The phone number is automatically formatted according to the selected country's standard format and includes the country code prefix.

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