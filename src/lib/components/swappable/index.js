import Array from './Array.svelte';
import Custom from './Custom.svelte';
import Fieldset from './Fieldset.svelte';
import Heading from './Heading.svelte';
import Html from './Html.svelte';
import Pages from './Pages.svelte';
import Text from './Text.svelte';
import Textarea from './Textarea.svelte';
import _Label from './_Label.svelte';
import _Validation from './_Validation.svelte';
import _FieldContainer from './_FieldContainer.svelte';
import Select from './Select.svelte';
import MultiSelect from './MultiSelect.svelte';
import Radio from './Radio.svelte';

export default {
	// fieldtypes
	array: Array,
	custom: Custom,
	fieldset: Fieldset,
	heading: Heading,
	html: Html,
	multiselect: MultiSelect,
	pages: Pages,
	radio: Radio,
	select: Select,
	text: Text,
	textarea: Textarea,

	// other
	_label: _Label,
	_validation: _Validation,
	_fieldcontainer: _FieldContainer
};
