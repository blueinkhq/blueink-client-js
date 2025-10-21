const isEmpty = require('lodash.isempty');
const { FIELD_KIND } = require('../constants.js');

/**
 * AutoPlacementHelper - Helper class to construct auto-placement configurations
 * Auto Placement automatically places fields on PDFs based on specific string inputs.
 */
class AutoPlacementHelper {
	/**
	 * Create a new AutoPlacementHelper
	 * @param {object} config - Auto placement configuration
	 * @param {string} config.kind - Field type (sig, sdt, txt, chk, etc.)
	 * @param {string} config.search - String to search for in the document
	 * @param {number} [config.h] - Height of the field
	 * @param {number} [config.w] - Width of the field
	 * @param {number} [config.offset_x] - X offset from the search string
	 * @param {number} [config.offset_y] - Y offset from the search string
	 * @param {string[]} [config.editors] - Array of signer keys who can edit this field
	 */
	constructor(config) {
		this.config = { ...config };
		this.validate();
	}

	/**
	 * Validate the auto-placement configuration
	 * @private
	 */
	validate() {
		const errors = [];
		const noBlankMessage = 'This field must not be blank.';

		// Validate required fields
		if (!this.config.kind) {
			errors.push({
				field: 'kind',
				message: noBlankMessage,
			});
		}
		if (!this.config.search) {
			errors.push({
				field: 'search',
				message: noBlankMessage,
			});
		}

		// Validate kind is valid
		if (this.config.kind && !Object.values(FIELD_KIND).includes(this.config.kind)) {
			errors.push({
				field: 'kind',
				message: 'kind is invalid.',
			});
		}

		// Validate editors if provided
		if (this.config.editors && !Array.isArray(this.config.editors)) {
			errors.push({
				field: 'editors',
				message: 'editors must be an array',
			});
		}

		// Validate numeric fields if provided
		if (this.config.h !== undefined && typeof this.config.h !== 'number') {
			errors.push({
				field: 'h',
				message: 'h must be a number',
			});
		}
		if (this.config.w !== undefined && typeof this.config.w !== 'number') {
			errors.push({
				field: 'w',
				message: 'w must be a number',
			});
		}
		if (this.config.offset_x !== undefined && typeof this.config.offset_x !== 'number') {
			errors.push({
				field: 'offset_x',
				message: 'offset_x must be a number',
			});
		}
		if (this.config.offset_y !== undefined && typeof this.config.offset_y !== 'number') {
			errors.push({
				field: 'offset_y',
				message: 'offset_y must be a number',
			});
		}

		if (!isEmpty(errors)) {
			throw errors;
		}
	}

	/**
	 * Set the height of the field
	 * @param {number} height - Height value
	 * @returns {AutoPlacementHelper} - Returns this for chaining
	 */
	setHeight(height) {
		if (typeof height !== 'number') {
			throw new Error('Height must be a number');
		}
		this.config.h = height;
		return this;
	}

	/**
	 * Set the width of the field
	 * @param {number} width - Width value
	 * @returns {AutoPlacementHelper} - Returns this for chaining
	 */
	setWidth(width) {
		if (typeof width !== 'number') {
			throw new Error('Width must be a number');
		}
		this.config.w = width;
		return this;
	}

	/**
	 * Set the X offset
	 * @param {number} offset - X offset value
	 * @returns {AutoPlacementHelper} - Returns this for chaining
	 */
	setOffsetX(offset) {
		if (typeof offset !== 'number') {
			throw new Error('Offset X must be a number');
		}
		this.config.offset_x = offset;
		return this;
	}

	/**
	 * Set the Y offset
	 * @param {number} offset - Y offset value
	 * @returns {AutoPlacementHelper} - Returns this for chaining
	 */
	setOffsetY(offset) {
		if (typeof offset !== 'number') {
			throw new Error('Offset Y must be a number');
		}
		this.config.offset_y = offset;
		return this;
	}

	/**
	 * Set the editors (signers) who can edit this field
	 * @param {string[]} editors - Array of signer keys
	 * @returns {AutoPlacementHelper} - Returns this for chaining
	 */
	setEditors(editors) {
		if (!Array.isArray(editors)) {
			throw new Error('Editors must be an array');
		}
		this.config.editors = editors;
		return this;
	}

	/**
	 * Add an editor (signer) to the field
	 * @param {string} editor - Signer key
	 * @returns {AutoPlacementHelper} - Returns this for chaining
	 */
	addEditor(editor) {
		if (!this.config.editors) {
			this.config.editors = [];
		}
		if (!Array.isArray(this.config.editors)) {
			throw new Error('Editors must be an array');
		}
		this.config.editors.push(editor);
		return this;
	}

	/**
	 * Get the auto-placement configuration
	 * @returns {object} - Auto-placement configuration object
	 */
	getConfig() {
		return { ...this.config };
	}

	/**
	 * Create a signature field auto-placement
	 * @param {string} searchString - String to search for
	 * @param {object} [options] - Additional options
	 * @returns {AutoPlacementHelper} - New AutoPlacementHelper instance
	 */
	static createSignature(searchString, options = {}) {
		return new AutoPlacementHelper({
			kind: FIELD_KIND.ESIGNATURE,
			search: searchString,
			...options,
		});
	}

	/**
	 * Create a date field auto-placement
	 * @param {string} searchString - String to search for
	 * @param {object} [options] - Additional options
	 * @returns {AutoPlacementHelper} - New AutoPlacementHelper instance
	 */
	static createDate(searchString, options = {}) {
		return new AutoPlacementHelper({
			kind: FIELD_KIND.SIGNINGDATE,
			search: searchString,
			...options,
		});
	}

	/**
	 * Create a text field auto-placement
	 * @param {string} searchString - String to search for
	 * @param {object} [options] - Additional options
	 * @returns {AutoPlacementHelper} - New AutoPlacementHelper instance
	 */
	static createText(searchString, options = {}) {
		return new AutoPlacementHelper({
			kind: FIELD_KIND.TEXT,
			search: searchString,
			...options,
		});
	}

	/**
	 * Create a checkbox field auto-placement
	 * @param {string} searchString - String to search for
	 * @param {object} [options] - Additional options
	 * @returns {AutoPlacementHelper} - New AutoPlacementHelper instance
	 */
	static createCheckbox(searchString, options = {}) {
		return new AutoPlacementHelper({
			kind: FIELD_KIND.CHECKBOXES,
			search: searchString,
			...options,
		});
	}

	/**
	 * Create an initial field auto-placement
	 * @param {string} searchString - String to search for
	 * @param {object} [options] - Additional options
	 * @returns {AutoPlacementHelper} - New AutoPlacementHelper instance
	 */
	static createInitial(searchString, options = {}) {
		return new AutoPlacementHelper({
			kind: FIELD_KIND.INITIALS,
			search: searchString,
			...options,
		});
	}
}

module.exports = AutoPlacementHelper;

