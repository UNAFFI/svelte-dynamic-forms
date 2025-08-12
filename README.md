# unaffi-fields-lib

This is a Svelte library for building dynamic forms with swappable field components, driven by JSON/Javascript object definitions. Fields support dynamic validation, conditional rendering, and can write to a specified bindable data path.

## Features

- **Dynamic form rendering** from JSON definitions
- **Swappable field components** (customize field UI)
- **Validation and conditional logic** via expressions
- **Nested fields and fieldsets**
- **Custom field types**

---

## Usage

### Basic Example

```svelte
<script>
	import Form from 'unaffi-fields-lib/src/lib/components/Form.svelte';
	let formContext = {};
	let formConfig = {
		fields: [
			{
				name: 'first_name',
				fieldtype: 'text',
				label: 'First Name',
				placeholder: 'Enter your first name',
				validations: [
					{ expression: '$string(params[0]) and $length(params[0]) > 0', error_message: 'Required' }
				],
				state_params: ['data.first_name']
			},
			{
				name: 'age',
				fieldtype: 'text',
				label: 'Age',
				validations: [
					{ expression: 'params[0] >= 18', error_message: 'Must be 18 or older' }
				],
				state_params: ['data.age']
			}
		]
	};
</script>

<Form context={formContext} config={formConfig} />
```

---

## `<Form />` Component

### Props

- `config` (**required**): The form configuration object. Must include a `fields` array.
- `context` (optional): The form state context. If omitted, a default context is created. Should be a bindable object to access form data and state.
- `swappable_components` (optional): An object mapping component keys to Svelte components, allowing you to override default field UIs.

### Context Structure

- `context.data`: The form's data object (populated as users fill the form).
- `context.state`: The form's state object (validation, conditions, etc).
- `context.show_validation`: Boolean to control validation message display.

---

## Field Definition

Each field in the `fields` array is an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | The unique name of the field. Required. |
| `fieldtype` | `'array' \| 'custom' \| 'fieldset' \| 'pages' \| 'text'` | The type of field. Required. |
| `data_path` | `string` | Path in `context.data` where the value is stored. Defaults to `name`. |
| `parent_data_path` | `string` | Path for the parent field's value (for nesting). |
| `fields` | `FieldDefinition[]` | Child fields (for fieldsets, arrays, etc). |
| `state_params` | `string[]` | Expressions for state/validation/condition params. |
| `validations` | `ValidationCheck[]` | Array of validation checks (see below). |
| `conditions` | `ConditionCheck[]` | Array of condition checks (see below). |
| `default` | `string` | Expression for the default value. |
| `keep_data_on_conditions_failed` | `boolean` | If true, keeps data when conditions fail. |
| `placeholder` | `string` | Placeholder text for the field. |
| `label` | `string` | Label text for the field. Defaults to `name`. |
| `hide_label` | `boolean` | If true, hides the label. |
| `item_config` | `FormProps["config"]` | Config for a new entry (for arrays). |
| `pages` | `FormProps["config"][]` | Config for pages (for `pages` fieldtype). |
| `custom_component_key` | `string` | Key for a custom field component. |

### ValidationCheck

```js
{
	expression: string, // Expression evaluated with params (see state_params)
	error_message?: string // Message shown if validation fails
}
```

### ConditionCheck

```js
{
	expression: string // Expression evaluated with params (see state_params)
}
```

### Example Field

```js
{
	name: 'email',
	fieldtype: 'text',
	label: 'Email',
	placeholder: 'Enter your email',
	validations: [
		{ expression: '/.+@.+\\..+/.test(params[0])', error_message: 'Invalid email' }
	],
	state_params: ['data.email']
}
```

---

## Field Types

- `text`: Standard text input
- `array`: Repeating group of fields
- `fieldset`: Group of fields
- `pages`: Multi-page form
- `custom`: Use a custom Svelte component (see `custom_component_key`)

---

## Swappable Components

You can override default field containers, labels, validation messages, etc. by passing a `swappable_components` prop:

```js
import MyFieldContainer from './MyFieldContainer.svelte';
<Form ... swappable_components={{ _fieldcontainer: MyFieldContainer }} />
```

---

## Advanced: Nested Fields & Data Paths

Fields can be nested using the `fields` property. Data is written to nested paths in `context.data` as specified by `data_path` and `parent_data_path`.

---

## License

MIT