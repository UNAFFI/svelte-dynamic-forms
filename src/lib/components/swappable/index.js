import Array from './Array.svelte';
import Checkbox from './Checkbox.svelte';
import Checkboxes from './Checkboxes.svelte';
import Custom from './Custom.svelte';
import Date from './Date.svelte';
import Datetime from './Datetime.svelte';
import Fieldset from './Fieldset.svelte';
import Heading from './Heading.svelte';
import Html from './Html.svelte';
import Pages from './Pages.svelte';
import Text from './Text.svelte';
import Textarea from './Textarea.svelte';
import Time from './Time.svelte';
import Number from './Number.svelte';
import _Label from './_Label.svelte';
import _Validation from './_Validation.svelte';
import _FieldContainer from './_FieldContainer.svelte';
import Select from './Select.svelte';
import MultiSelect from './MultiSelect.svelte';
import Radio from './Radio.svelte';
import Json from './Json.svelte';
import Tel from './Tel.svelte';

export default {
	// fieldtypes
	array: Array,
	checkbox: Checkbox,
	checkboxes: Checkboxes,
	custom: Custom,
	date: Date,
	datetime: Datetime,
	fieldset: Fieldset,
	heading: Heading,
	html: Html,
	json: Json,
	multiselect: MultiSelect,
	number: Number,
	pages: Pages,
	radio: Radio,
	select: Select,
	tel: Tel,
	text: Text,
	textarea: Textarea,
	time: Time,

	// other
	_label: _Label,
	_validation: _Validation,
	_fieldcontainer: _FieldContainer
};
