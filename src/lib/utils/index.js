/**
 * @param {string} [name]
 * @returns {string} Key derived from the name.
 */
export function getKeyFromName(name = '') {
	// return lowercase and replace whitespaces with single underscore and trim
	return name.toLowerCase().trim().replace(/\s+/g, '_');
}

/**
 * @summary Debounce function to limit how often a function is called.
 *
 * @description
 * This function returns a new function that executes immediately on the first call,
 * then debounces subsequent calls within the delay period. It returns a promise 
 * that resolves with the result of the function execution.
 *
 * @example
 * const debouncedHello = debounce(() => console.log('Hello'), 1000);
 * // First call executes immediately, subsequent calls within 1000ms are debounced
 *
 * @template T
 * @param {(...args: any[]) => T | Promise<T>} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {(...args: any[]) => Promise<T>} - A new function that debounces the execution of the original function.
 *
 * @since 1.0.0
 */
export function debounce(func, delay) {
	/**@type {number | NodeJS.Timeout} */
	let timeout;
	/**@type {boolean} */
	let isFirstCall = true;

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
					isFirstCall = true;
				}, delay);
				return;
			}

			// For subsequent calls, debounce normally
			clearTimeout(timeout);
			timeout = setTimeout(async () => {
				const result = await func(...args);
				resolve(result);
				// Reset first call flag after execution
				isFirstCall = true;
			}, delay);
		});
	};
}