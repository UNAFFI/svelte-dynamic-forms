/**
 * @typedef {"array" | "custom" | "fieldset" | "pages" | "text"} FieldType
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
 * @typedef {object} FieldDefinition
 * @property {string} name - The name of the field.
 * @property {FieldType} fieldtype - The type of the field.
 * @property {string} [data_path] - The path where the field's value should be written.
 * @property {string} [parent_data_path] - The path where the parent field's value should be written.
 * @property {string} [default] - Template expression for the default field value. This gets evaluated only once.
 * @property {string[]} [template_dependencies] - Derived values that trigger the field's template expressions to re-evaluate.
 * @property {FieldDefinition[]} [fields] - The child fields of the field.
 * @property {Validation[]} [validations] - The validation for the field.
 * @property {Condition[]} [conditions] - The conditions for the field.
 * @property {boolean} [keep_data_on_conditions_failed] - Whether to keep the data when conditions fail.
 * @property {string} [content] - Template expression for the content text.
 * @property {string} [placeholder] - Template expression for the placeholder text.
 * @property {string} [label] - Template expression for the label text.
 * @property {boolean} [hide_label] - Whether to hide the label for the field.
 * @property {FormProps["config"]} [array_item_config] - The configuration for a new entry.
 * @property {FormProps["config"][]} [pages] - The configuration for the pages.
 * @property {string} [custom_component_key] - The key for the custom component.
 * @property {Record<string, string>} [template_context] - Additional context for template expressions.
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
 */

/**
 * @typedef {FieldDefinitionWithRequired & FormattedFieldDefinitionParts} FormattedFieldDefinition
 */

/**
 * @typedef {object} FormProps
 * @property {object} config - The configuration for the form.
 * @property {FieldDefinition[]} [config.fields] - The fields that are part of the form.
 * @property {object} [context] - The context of the form.
 * @property {boolean} [context.show_validation] - Whether to show validation messages.
 * @property {any} [context.data] - The form result.
 * @property {Record<string, any>} [context.state] - The form state (will be initialized to {}).
 * @property {Record<string, import('svelte').SvelteComponent>} [swappable_components] - The components used in the form.
 */
