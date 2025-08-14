/**
 * @typedef {"array" | "checkboxes" | "custom" | "date" | "datetime" | "fieldset" | "multiselect" | "pages" | "radio" | "select" | "text" | "textarea" | "time"} FieldType
 */

/**
 * @typedef {object} Validation
 * @property {string} expression - Template expression for the validation. If truthy, the validation is met.
 * @property {string} [error_message] - The error message for the validation.
 */

/**
 * @typedef {object} Condition
 * @property {string} expression - Template expression for the condition. If truthy, the condition is met.
 */

/**
 * @typedef {object} Option
 * @property {string} label - The label for the option
 * @property {string} value - The value for the option
 */

/**
 * @typedef {object} FieldDefinition
 * @property {FieldType} fieldtype - Determines the component to render
 * @property {string} [name] -  Used primarily to determine where the field will write data but it has UI implications as well (e.g. label and placeholder)
 * @property {string} [data_path] - Determines where in 'context.data' the field's value should be written (default is snake case of 'name')
 * @property {string} [default] - Will be set in the field's 'data_path' if no value is defined yet (evaluated as template on field mount)
 * @property {string} [label] - Used in certain fieldtypes like text (evaluated whenever the template_dependencies change)
 * @property {boolean} [hide_label] - Set to true if you want to hide the field label
 * @property {string} [placeholder] - Used in certain fieldtypes like text (evaluated whenever the template_dependencies change)
 * @property {string} [content] - Used in certain fieldtypes like heading (evaluated whenever the template_dependencies change)
 * @property {string[]} [template_dependencies] - Triggers re-evaluation of various template expressions for the field
 * @property {Record<string, string>} [template_context] - Gets re-evaluated first and can then be used in subsequent evaluations
 * @property {Condition[]} [conditions] - Every condition must be met for the field to render (evaluated whenever the template_dependencies change)
 * @property {boolean} [keep_data_on_conditions_failed] - Set to true if you want the data written in conditional fields to persist even if the conditions fail
 * @property {Validation[]} [validations] - Every validation must be met for the field to be valid (evaluated whenever the template_dependencies change)
 * @property {FieldDefinition[]} [fields] - Child fields of this field. Used in certain fieldtypes like fieldset
 * @property {FormProps["config"]} [array_item_config] - Config for every item in array. Used in certain fieldtypes like array
 * @property {FormProps["config"][]} [pages] - Config for every page in pages. Used in certain fieldtypes like pages
 * @property {string} [custom_component_key] - The key for the custom component (passed via swappable components) to render. Used in certain fieldtypes like custom
 * @property {Option[] | string} options - The options for the field. Used in certain fieldtypes like select (evaluated whenever the template_dependencies change)
 */

/**
 * @typedef {Omit<FieldDefinition, 'data_path'> &
 *           Required<Pick<FieldDefinition, 'data_path'>>} FieldDefinitionWithRequired
 */

/**
 * @typedef {object} FormattedFieldDefinitionParts
 * @property {string} data_key - The final key of the potentially nested data_path
 * @property {string} state_path - The path where the field's state should be written
 * @property {string} parent_state_path - The path where the parent field's state should be written.
 * @property {string} parent_data_path - The path where the parent field's value should be written.
 */

/**
 * @typedef {FieldDefinitionWithRequired & FormattedFieldDefinitionParts} FormattedFieldDefinition
 */

/**
 * @typedef {object} FormProps
 * @property {object} config - The configuration for the form
 * @property {boolean} [config.show_validation] - Whether to show validation messages. If false then the validation will still be calculated but the UI components will not show
 * @property {string} [config.form_id] - The unique identifier for the form. (This is generated when the form is created if not provided)
 * @property {FieldDefinition[]} [config.fields] - The fields that are part of the form
 * @property {object} [context] - The context of the form. This is a bindable prop that can be modified from outside the form
 * @property {boolean} [context.show_validation] - Whether to show validation messages. If false then the validation will still be calculated but the UI components will not show
 * @property {string} [context.form_id] - The unique identifier for the form. (This is generated when the form is created if not provided)
 * @property {any} [context.data] - The data that the fields create.
 * @property {Record<string, any>} [context.state] - The state for all the fields in the form (will be initialized to {})
 * @property {Record<string, import('svelte').SvelteComponent>} [swappable_components] - The components used in the form (will have some defaults)
 */

/**
 * @typedef {Object} FormValidationResult
 * @property {boolean} is_valid - if true then all fields in the form are valid
 * @property {boolean} is_validation_timeout - if true then the validation failed to complete on time
 * @property {boolean} is_validation_failed - if true then the validation failed to complete
 * @property {Array<{state_path: string, error_message: string}>} issues - The validation issues found in the form
 */
