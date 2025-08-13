import Array from './Array.svelte';
import Custom from './Custom.svelte';
import Fieldset from './Fieldset.svelte';
import Heading from './Heading.svelte';
import Html from './Html.svelte';
import Pages from './Pages.svelte';
import Text from './Text.svelte';
import _Label from './_Label.svelte';
import _Validation from './_Validation.svelte';
import _FieldContainer from './_FieldContainer.svelte';

export default {
	// fieldtypes
	array: Array,
	custom: Custom,
	fieldset: Fieldset,
	heading: Heading,
	html: Html,
	pages: Pages,
	text: Text,

	// other
	_label: _Label,
	_validation: _Validation,
	_fieldcontainer: _FieldContainer
};
