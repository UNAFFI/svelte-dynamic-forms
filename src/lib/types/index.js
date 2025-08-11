/**
 * @typedef {"array" | "custom" | "fieldset" | "pages" | "text"} FieldType
 */

/**
 * @typedef {object} ValidationCheck
 * @property {string} expression - Evaluated whenever the field state params change
 * @property {string} [error_message] - The error message for the validation.
 */

/**
 * @typedef {ValidationCheck[]} Validations - The checks to perform for the validation.
 */

/**
 * @typedef {object} ConditionCheck
 * @property {string} expression - Evaluated whenever the field state params change
 */

/**
 * @typedef {ConditionCheck[]} Conditions - The checks to perform for the conditions.
 */

/**
 * @typedef {object} FieldDefinition
 * @property {string} name - The name of the field.
 * @property {FieldType} fieldtype - The type of the field.
 * @property {string} [data_path] - The path where the field's value should be written.
 * @property {string} [parent_data_path] - The path where the parent field's value should be written.
 * @property {FieldDefinition[]} [fields] - The child fields of the field.
 * @property {string[]} [state_params] - The parameters used in conditions and validations.
 * @property {Validations} [validations] - The validation for the field.
 * @property {Conditions} [conditions] - The conditions for the field.
 * @property {string} [default] - Expression for the default value of the field.
 * @property {boolean} [keep_data_on_conditions_failed] - Whether to keep the data when conditions fail.
 * @property {string} [placeholder] - The placeholder text for the field.
 * @property {string} [label] - The label text for the field.
 * @property {boolean} [hide_label] - Whether to hide the label for the field.
 * @property {FormProps["config"]} [item_config] - The configuration for a new entry.
 * @property {FormProps["config"][]} [pages] - The configuration for the pages.
 * @property {string} [custom_component_key] - The key for the custom component.
 */

/**
 * @typedef {Omit<FieldDefinition, 'data_path' | 'validations' | 'conditions' | 'fields' | 'state_params'> &
 *           Required<Pick<FieldDefinition, 'data_path' | 'validations' | 'conditions' | 'fields' | 'state_params'>>} FieldDefinitionWithRequired
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
