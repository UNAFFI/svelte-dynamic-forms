/**
 * @typedef {object} FormProps
 * @property {string} [form_id] Unique identifier for the form. The fields' html elements will have IDs based on this.
 * @property {boolean} [show_validation] Whether to show validation errors for the form. This is only a boolean value that can be used to style field components' validation display.
 * @property {FieldProps[]} [fields] Array of field properties. Alternatively, you can render [Field]s inside the form to have more flexibility in terms of styling etc.
 * @property {Record<string, import("svelte").SvelteComponent>} [components] Map of fieldtype - components. These are meant to be custom components that bind to the field_data and field_metadata.
 * @property {any} [context] Context for the form. This is not necessary but if passed will be available in the dynamically evaluated parts of the form (e.g. validations, conditions).
 * @property {object} [data] The form's data. The fields of the form will write to this value.
 * @property {Record<string, any>} [default_values] Map of fieldtype - default values.
 * @property {Record<string, FieldMetadata>} [metadata] Map of [field_id] - field metadata. This will be re-initialized when the form is mounted. Bind to the value to get insight about the form (e.g. read individual field validation results).
 * @property {FormSettings} [settings] Settings for the form. This will be re-initialized when the form is mounted. Bind to the value to get insight about the form (e.g. read form validation results).
 */

/**
 * @typedef {object} FieldProps
 * @property {FieldData} [field_data]
 * @property {FieldMetadata} [field_metadata]
 * @property {FieldMetadata["definition"]["fieldtype"]} [fieldtype] Points to a component and default_values that should be used for the field. Can be an expression that will evaluate on field mount.
 * @property {FieldMetadata["definition"]["name"]} [name] The name of the field. Can be an expression that will evaluate on field mount.
 * @property {FieldMetadata["definition"]["parent_field_id"]} [parent_field_id] The field_id of the parent field, if any.
 * @property {import("svelte").SvelteComponent} [component] The component to use for the field. If not provided, the fieldtype will be used to look up the component in the components map.
 * @property {FieldMetadata["definition"]["dependencies"] | string} [dependencies] The list of dependencies that trigger re-evaluation of dynamic values (e.g. validations, conditions). Can be an expression that will evaluate on field mount.
 * @property {FieldMetadata["definition"]["keep_data_on_conditions_failed"] | string} [keep_data_on_conditions_failed] Whether to keep the data on the field if its conditions fail. Can be an expression that will evaluate on field mount.
 * @property {FieldMetadata["definition"]["parent_data_path"]} [parent_data_path] The data_path of the parent field, if any.
 * @property {FieldMetadata["definition"]["data_path"] | string} [data_path] Where the field will write data. Can be an expression that will evaluate on field mount.
 * @property {FieldMetadata["definition"]["default_value"] | string} [default_value] Default value set by the field explicitly. Can be an expression that will evaluate on field mount.
 * @property {FieldMetadata["definition"]["settings"] | string} [settings] Any field settings that only get evaluated when the field mounts. Can be an expression that will evaluate on field mount.
 * @property {FieldMetadata["definition"]["dynamic_settings"]} [dynamic_settings] Any field settings that get re-evaluated when dependencies change.
 * @property {FieldMetadata["definition"]["validations"]} [validations] The validations to apply to the field.
 * @property {FieldMetadata["definition"]["conditions"]} [conditions] The conditions to apply to the field.
 */

/**
 * @typedef {Record<string, any>} FieldData
 */

/**
 * @typedef {object} FieldMetadata
 * @property {string} field_id Unique identifier for the field.
 * @property {string} data_key The key that the field will write to in field_data.
 * @property {any} [init_value] Initial value as it is passed in via the form data.
 * @property {any} [default_value] Default value as passed in via the field definition or via the form default_values.
 * @property {object} validations Validations state for the field.
 * @property {boolean} [validations.is_valid] Whether the field is valid.
 * @property {string} [validations.error_message] The error message for the field if it is invalid.
 * @property {boolean} [validations.previous_result] The previous result of the validations check.
 * @property {{ is_valid: boolean, error_message: string }[]} [validations.checks] Array of validation checks for the field.
 * @property {object} conditions Conditions state for the field.
 * @property {boolean} [conditions.is_passed] True if all conditions have passed.
 * @property {boolean} [conditions.previous_result] The previous result of the conditions check.
 * @property {any} [dynamic_settings] Any field settings that get re-evaluated every time the field dependencies change.
 * @property {boolean} dependencies_changed If true it means that a dependency of this field has changed and therefore dynamic field content (e.g. validations, conditions) may be out of sync.
 * @property {object} definition The definition of the field.
 * @property {string} definition.name The name of the field.
 * @property {string} definition.fieldtype Points to a component and default_values that should be used for the field.
 * @property {string} [definition.parent_field_id] The field_id of the parent field, if any.
 * @property {string[]} definition.dependencies The list of dependencies that trigger re-evaluation of dynamic values (e.g. validations, conditions)
 * @property {boolean} definition.keep_data_on_conditions_failed Whether to keep the changes on a previous field whose conditions failed after having changes made.
 * @property {string} [definition.parent_data_path] The data_path of the parent field, if any.
 * @property {string} definition.data_path Where the field will write data
 * @property {any} [definition.default_value] Default value set by the field explicitly
 * @property {any} [definition.settings] Any field settings that only get evaluated when the field mounts
 * @property {any} [definition.dynamic_settings] Any field settings that get re-evaluated every time the field dependencies change.
 * @property {{ expression: string, error_message: string }[]} [definition.validations] Array of validation definitions for the field. They are re-evaluated every time the dependencies changes and the result is stored in field_metadata.validations.
 * @property {{ expression: string }[]} [definition.conditions] Array of condition definitions for the field. They are re-evaluated every time the dependencies changes and the result is stored in field_metadata.conditions.
 */

/**
 * @typedef {object} FormSettings
 * @property {string} form_id Unique identifier for the form.
 * @property {object} validations Validations state for the form.
 * @property {boolean} [validations.is_show] Whether to show validation errors for the form.
 * @property {boolean} [validations.is_valid] Whether the form is valid.
 * @property {number} [validations.max_time] The maximum time allowed for the form validations (in MS).
 * @property {number} [validations.check_interval] The time interval between attempts for form validation.
 * @property {boolean} [validations.is_failed] If true it means the form validation couldn't complete
 * @property {boolean} [validations.is_timeout] If true it means the form validation timed out.
 * @property {Array<{field_id: string, error_message?: string}>} [validations.issues] List of validation issues found in the form.
 * @property {number} [validations.duration] The duration of the validation process (in MS).
 */
