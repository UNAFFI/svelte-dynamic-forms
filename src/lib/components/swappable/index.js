import Array from './Array.svelte';
import Custom from './Custom.svelte';
import Fieldset from './Fieldset.svelte';
import Pages from './Pages.svelte';
import Text from './Text.svelte';
import _Label from './_Label.svelte';
import _Validation from './_Validation.svelte';
import _FieldWrapper from './_FieldWrapper.svelte';

export default {
	// fieldtypes
	array: Array,
	custom: Custom,
	fieldset: Fieldset,
	pages: Pages,
	text: Text,

	// other
	_label: _Label,
	_validation: _Validation,
	_fieldwrapper: _FieldWrapper
};
