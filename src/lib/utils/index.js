import jsonata from 'jsonata';
import Mustache from 'mustache';

/**
 * @description Returns lowercase and replaces anything other than letters and numbers with single underscore and trim
 * @param {string} [string] Unformatted string
 * @returns {string} Formatted string
 */
export function stringToSnakeCase(string = '') {
	return string
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9/.]+/g, '_');
}

/**
 * @description Returns a random 12 character string.
 * @returns {string} A random 12 character string.
 */
export function randomId() {
	return Math.random().toString(36).substring(2, 14);
}

/**
 * @description Creates a debounced version of a function that delays its execution until after a specified delay period.
 * @template T
 * @param {(...args: any[]) => T | Promise<T>} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {(...args: any[]) => Promise<T>} - A new function that debounces the execution of the original function.
 */
export function debounce(func, delay, is_delayed = false) {
	/**@type {number | NodeJS.Timeout} */
	let timeout;
	/**@type {boolean} */
	let isFirstCall = !is_delayed;

	return function (...args) {
		return new Promise((resolve) => {
			// Execute immediately on first call
			if (isFirstCall) {
				isFirstCall = false;

				// Execute the function and handle the result
				const executeAndResolve = async () => {
					const result = await func(...args);
					resolve(result);
				};
				executeAndResolve();

				// Set timeout to reset the first call flag
				timeout = setTimeout(() => {
					isFirstCall = !is_delayed;
				}, delay);
				return;
			}

			// For subsequent calls, debounce normally
			clearTimeout(timeout);
			timeout = setTimeout(async () => {
				const result = await func(...args);
				resolve(result);
				// Reset first call flag after execution
				isFirstCall = !is_delayed;
			}, delay);
		});
	};
}

/**
 * @description Evaluates a template using Mustache or JSONata based on the context provided.
 * @param {any} [template]
 * @param {any} [context]
 * @returns {Promise<any>}
 */
export async function evaluateTemplate(template, context) {
	if (template === undefined) return;
	if (!context) return template;
	try {
		let result;

		if (Array.isArray(template)) {
			const promises = template.map((item) => evaluateTemplate(item, context));
			result = await Promise.all(promises);
		} else if (typeof template === 'object') {
			const promises = Object.entries(template).map(async ([key, value]) => {
				const evaluatedValue = await evaluateTemplate(value, context);
				return [key, evaluatedValue];
			});
			result = Object.fromEntries(await Promise.all(promises));
		} else if (typeof template === 'string') {
			// get the templating key from the start of the template (if any). The templating key must be at the start of the template inside two square brackets like [[jsonata]] = templating language - jsonata
			const templating_key = template.match(/^\[\[(.*?)\]\]/)?.[1];

			if (templating_key === 'jsonata') {
				const template_part = template.match(/^\[\[jsonata\]\](.*)/)?.[1] ?? '';
				result = await jsonata(template_part).evaluate(context);
			} else {
				const renderer = /** @type {any} */ (Mustache)?.render;
				if (typeof renderer === 'function') {
					result = renderer(template, context);
				} else {
					result = template;
				}
			}
		} else {
			result = template;
		}
		return result;
	} catch (err) {
		console.error(`Error interpolating template "${template}":`, err);
	}
	return;
}
