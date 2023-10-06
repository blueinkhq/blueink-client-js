const { FormDataEncoder } = require('form-data-encoder');
const { FormData, File } = require('formdata-node');
const { fileFromPathSync } = require('formdata-node/file-from-path');
const isEmpty = require('lodash.isempty');
const get = require('lodash.get');
const has = require('lodash.has');
const { Readable } = require('stream');

const { sampleBundle } = require('../../seed/sample.js');
const { generateKey } = require('../../util/utility.js');
const { FIELD_KIND } = require('../constants.js');

class BundleHelper {
	/**
	 * Define a Bundle Helper
	 * @param {object} newBundleData
	 * @param {string} newBundleData.label
	 * @param {string} newBundleData.requester_email
	 * @param {string} newBundleData.requester_name
	 * @param {string} newBundleData.email_subject
	 * @param {string} newBundleData.email_message
	 * @param {boolean} newBundleData.in_order
	 * @param {string[]} newBundleData.cc_emails
	 * 
	 */
	constructor(newBundleData) {
		// Initialize bundle
		this.bundleData = { ...newBundleData };

		if (!has(newBundleData, 'cc_emails')) {
			this.bundleData.cc_emails = []
		}
		if (!has(newBundleData, 'documents')) {
			this.bundleData.documents = []
		}
		if (!has(newBundleData, 'packets')) {
			this.bundleData.packets = []
		}

		// Store the file info and will return it as FormData when the asData method get called.
		this.files = {};
	}

	/**
	 * Add a new Document to the bundle.
	 * @param {object} newDoc - Must include either file_url, file_path, or file_data.
	 * @param {string} [newDoc.file_url] - The url to the pdf document. If file_url is provided, file_path and file_data will be ignored.
	 * @param {string} [newDoc.file_path] -The path to the pdf file. If file_path is provided, file_data will be ignored.
	 * @param {object} [newDoc.file_data] - The data of the file.
	 * @param {string} [newDoc.file_b64] - The base 64 string of the file.
	 * @returns - Key of the Document.
	 */
	#addDocument = (newDoc) => {
		const key = generateKey('doc');
		if (!newDoc.key) newDoc.key = key;
		if (!newDoc.fields) newDoc.fields = [];

		if (
			!has(newDoc, 'file_path') &&
			!has(newDoc, 'file_url') &&
			!has(newDoc, 'file_data') &&
			!has(newDoc, 'file_b64')
		) {
			throw [
				{
					field: 'file_path/file_url/file_data/file_b64',
					message: 'This field must not be blank.',
				},
			];
		}

		// File path is used
		if (newDoc.file_path) {
			if (!has(newDoc, 'file_index')) {
				// Find current index
				const index = this.bundleData.documents.filter((doc) =>
					has(doc, 'file_index')
				).length;
				newDoc.file_index = index;
			}

			const file = fileFromPathSync(newDoc.file_path);

			// Form Data will store all of the files
			this.files[`files[${newDoc.file_index}]`] = file;
			delete newDoc.file_path;
		} else if (newDoc.file_data) {
			// File data is used
			if (!has(newDoc, 'file_index')) {
				// Find current index
				const index = this.bundleData.documents.filter((doc) =>
					has(doc, 'file_index')
				).length;

				newDoc.file_index = index;
			}
			const file = new File([newDoc.file_data.buffer], newDoc.file_data.originalname);
			this.files[`files[${newDoc.file_index}]`] = file;
			delete newDoc.file_data;
		} else if (newDoc.file_b64) {
			// File Base64 is used
			if (!has(newDoc, 'file_index')) {
				// Find current index
				const index = this.bundleData.documents.filter((doc) =>
					has(doc, 'file_index')
				).length;

				newDoc.file_index = index;
			}
			const file = new File([Buffer.from(newDoc.file_b64, 'base64')], newDoc.file_name);
			this.files[`files[${newDoc.file_index}]`] = file;
			delete newDoc.file_b64;
		}
		
		this.bundleData.documents.push(newDoc);
		return newDoc.key;
	};
	
	/**
	 * Add document by file path.
	 * @param {string} filePath - Path to the file.
	 * @param {object} additionalFields - Addition fields
	 * @returns - Key of the Document Template.
	 */
	addDocumentByPath = (filePath, additionalFields = {}) => {
		return this.#addDocument({ file_path: filePath, ...additionalFields });
	};

	/**
	 * Add document by file url.
	 * @param {string} fileURL - File URL.
	 * @param {object} additionalFields - Addition fields
	 * @returns - Key of the Document Template.
	 */
	addDocumentByUrl = (fileURL, additionalFields = {}) => {
		return this.#addDocument({ file_url: fileURL, ...additionalFields });
	};

	/**
	 * Add document by file data.
	 * @param {object} fileData - File data
	 * @param {object} additionalFields - Addition fields
	 * @returns - Key of the Document Template.
	 */
	addDocumentByFile = (fileData, additionalFields = {}) => {
		return this.#addDocument({ file_data: fileData, ...additionalFields });
	};

	/**
	 * Add document by base64 string.
	 * @param {string} fileName - String of the file name
	 * @param {string} fileB64 - Base 64 string of the file
	 * @param {object} additionalFields - Addition fields
	 * @returns - Key of the Document Template.
	 */
	addDocumentByB64 = (fileName, fileB64, additionalFields = {}) => {
		return this.#addDocument({ file_name: fileName, file_b64: fileB64, ...additionalFields });
	}

	/**
	 * Add a Document Template to the bundle.
	 * @param {object} template - Must include valid template id from BlueInk Dashboard.
	 * @param {string} template.template_id
	 * @returns - Key of the Document Template.
	 */
	addDocumentTemplate = (template) => {
		const error = [];
		const noBlankMessage = 'This field must not be blank.';
		if (!template.key) template.key = generateKey('tem');

		// Check template_id
		if (!template.template_id) {
			error.push({
				field: 'template_id',
				message: noBlankMessage,
			});
		}

		// Check assignments
		if (
			has(template, 'assignments') &&
			!Array.isArray(template.assignments)
		) {
			error.push({
				field: 'assignments',
				message: 'This field must be an array',
			});
		} else {
			for (let i in template.assignments) {
				if (!template.assignments[i].role) {
					error.push({
						field: `assignments[${i}].role`,
						message: noBlankMessage,
					});
				}
				if (!template.assignments[i].signer) {
					error.push({
						field: `assignments[${i}].signer`,
						message: noBlankMessage,
					});
				}
			}
		}

		//Check field_values
		if (template.field_values && !Array.isArray(template.field_values)) {
			error.push({
				field: `field_values`,
				message: 'This field must be an array.',
			});
		} else {
			for (let i in template.field_values) {
				if (!template.field_values[i].key) {
					error.push({
						field: `field_values[${i}].key`,
						message: noBlankMessage,
					});
				}
			}
		}

		if (isEmpty(error)) {
			this.bundleData.documents.push(template);
			return template.key;
		} else throw error;
	};

	/**
	 * Assign a Role to a Signer (Packet). Used when a Document Template is used.
	 * @param {string} signerKey
	 * @param {string} templateKey
	 * @param {string} roleKey
	 */
	assignRole = (signerKey, templateKey, roleKey) => {
		// Check if signer exists
		const signerIndex = this.bundleData.packets.findIndex(
			(signer) => signer.key === signerKey
		);
		if (signerIndex === -1) throw new Error('Signer key is invalid.');

		// Find the template
		const template = this.bundleData.documents.find(
			(template) => template.key === templateKey
		);
		if (!template) throw new Error('Document key is invalid.');
		if (!has(template, 'template_id')) {
			throw new Error(
				`Document with key ${templateKey} is not a template.`
			);
		}
		if (!template.assignments || !Array.isArray(template.assignments)) {
			template.assignments = [{ role: roleKey, signer: signerKey }];
		} else {
			template.assignments.push({ role: roleKey, signer: signerKey });
		}
		return template;
	};

	/**
	 * Add a Signer (Packet) to the bundle
	 * @param {object} newSigner
	 * @param {string} [newSigner.key]
	 * @param {string} newSigner.name
	 * @param {string} newSigner.email
	 * @param {string} [newSigner.phone]
	 * @param {boolean} [newSigner.auth_sms]
	 * @param {boolean} [newSigner.auth_selfie]
	 * @param {boolean} [newSigner.auth_id]
	 * @param {string} [newSigner.deliver_via]
	 * @returns - Key of the Signer.
	 */
	addSigner = (newSigner) => {
		const key = generateKey('signer');
		if (!newSigner.key) {
			newSigner.key = key;
		}
		this.bundleData.packets.push(newSigner);
		return newSigner.key;
	};

	/**
	 * Add a new Field to the Document. Field only need for DocumentRequest.
	 * @param {string} docKey - The Key of the Document.
	 * @param {object} newField - New Field
	 * @param {string} newField.kind
	 * @param {string} newField.x
	 * @param {string} newField.y
	 * @param {string} newField.w
	 * @param {string} newField.h
	 * @returns {string} - Key of the Field.
	 */
	addField = (docKey, newField) => {
		const errors = [];
		const noBlankMessage = 'This field must not be blank.';

		const requiredFields = ['kind', 'x', 'y', 'w', 'h'];
		requiredFields.forEach((field) => {
			if (!newField[field]) {
				errors.push({
					field,
					message: noBlankMessage,
				});
			}
		});

		if (!Object.values(FIELD_KIND).includes(newField.kind)) {
			errors.push({
				field: 'kind',
				message: 'kind is invalid.',
			});
		}
		if (!newField.key) newField.key = generateKey('field');

		const document = this.bundleData.documents.find(
			(doc) => doc.key === docKey
		);
		if (!document) {
			errors.push({
				field: 'docKey',
				message: `Document with key ${docKey} is invalid.`,
			});
		}
		if (has(newField, 'editors') && !Array.isArray(newField.editors)) {
			errors.push({
				field: 'editors',
				message: 'This field must be an array',
			});
		}

		if (!isEmpty(errors)) throw errors;

		document.fields.push(newField);
		return newField.key;
	};

	/**
	 * Initialize field value
	 * @param {string} docKey - The Key of the Document.
	 * @param {string} fieldKey - The Key of the Field.
	 * @param {(string|boolean)} value - The value of the Field.
	 * @returns - Key of the Field.
	 */
	initializeField = (docKey, fieldKey, value) => {
		const document = this.bundleData.documents.find(
			(doc) => doc.key === docKey
		);
		if (!document) {
			throw new Error(`Document with key ${docKey} is invalid.`);
		}
		
		const isTemplate = has(document, 'template_id'); // Document is template
		if (isTemplate) {
			const field_values = get(document, 'field_values', []);
			const index = field_values.findIndex(field => field.key === fieldKey);
			if (index !== -1) {
				field_values[index].initial_value = value;
			} else {
				field_values.push({
					key: fieldKey,
					initial_value: value,
				})
			}
			document.field_values = [...field_values];
			return fieldKey;
		} else {
			const fields = get(document, 'fields', []);
			const index = fields.findIndex(field => field.key === fieldKey);
			if (index !== -1) {
				fields[index].initial_value = value;
				document.fields = [...fields];
			} else {
				throw new Error(`Field with key ${fieldKey} cannot be found. The field must be added first.`)
			}
			return fieldKey;
		}
	}

	/**
	 * Set Document value
	 * @param {string} docKey
	 * @param {string} key
	 * @param {any} value
	 */
	setValue = (docKey, key, value) => {
		const document = this.bundleData.documents.find(
			(doc) => doc.key === docKey
		);
		if (!document) {
			throw new Error(`Document with key ${docKey} is invalid.`);
		}
		document[key] = value;
		return document;
	};

	/**
	 * Return the data for bundle.create
	 * @returns - Bundle Data
	 */
	asData = () => {
		// File is attached
		if (!isEmpty(this.files)) {
			const form = new FormData();
			for (let key in this.files) {
				form.append(key, this.files[key]);
			}
			form.append('bundle_request', JSON.stringify(this.bundleData));
			const encoder = new FormDataEncoder(form);
			return { data: Readable.from(encoder), headers: encoder.headers };
		}
		return this.bundleData;
	};
}

module.exports = BundleHelper;
