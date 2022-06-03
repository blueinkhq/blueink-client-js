import { FormDataEncoder } from 'form-data-encoder';
import { FormData, File } from 'formdata-node';
// import { fileFromPathSync } from 'formdata-node/file-from-path';
import isEmpty from 'lodash.isempty';
import { Readable } from 'stream';

import { sampleBundle } from '../../seed/sample.js';
import { generateKey } from '../../util/utility.js';
import {
	ATTACHMENT_TYPE,
	BUNDLE_ORDER,
	BUNDLE_STATUS,
	DELIVER_VIA,
	FIELD_KIND,
	PACKET_STATUS,
	V_PATTERN,
} from '../constants.js';

const has = Object.prototype.hasOwnProperty;


class BundleHelper {
	ATTACHMENT_TYPE = ATTACHMENT_TYPE
	BUNDLE_ORDER = BUNDLE_ORDER
	BUNDLE_STATUS = BUNDLE_STATUS
	DELIVER_VIA = DELIVER_VIA
	FIELD_KIND = FIELD_KIND
	PACKET_STATUS = PACKET_STATUS
	V_PATTERN = V_PATTERN

	/**
	 * Define a Bundle Helper
	 * @param {Object} newBundleData
	 * @param {string} newBundleData.label
	 * @param {string} newBundleData.requester_email
	 * @param {string} newBundleData.requester_name
	 * @param {string} newBundleData.email_subject
	 * @param {string} newBundleData.email_message
	 */
	constructor(newBundleData) {
		// Initialize bundle
		this.bundleData = { ...sampleBundle, ...newBundleData };

		// Store the file info and will return it as FormData when the asData method get called.
		this.files = {};
	}

	/**
	 * Add a new Document to the bundle.
	 * @param {Object} newDoc - Must include either file_url, file_path, or file_data.
	 * @param {string} [newDoc.file_url] - The url to the pdf document. If file_url is provided, file_path and file_data will be ignored.
	 * @param {string} [newDoc.file_path] -The path to the pdf file. If file_path is provided, file_data will be ignored.
	 * @param {Buffer} [newDoc.file_data] - The buffer of the file.
	 * @returns - Key of the Document.
	 */
	#addDocument = (newDoc) => {
		const key = generateKey('doc');
		if (!newDoc.key) newDoc.key = key;
		if (!newDoc.fields) newDoc.fields = [];

		if (!has.call(newDoc, 'file_path') && !has.call(newDoc, 'file_url') && !has.call(newDoc, 'file_data')) {
			throw [
				{
					field: 'file_path/file_url/file_data',
					message: 'This field must not be blank.',
				},
			];
		}

		// File path is used
		if (newDoc.file_path) {
			if (!has.call(newDoc, 'file_index')) {
				// Find current index
				const index = this.bundleData.documents.filter((doc) => has.call(doc, 'file_index')).length;

				newDoc.file_index = index;
			}

			const file = fileFromPathSync(newDoc.file_path);

			// Form Data will store all of the files
			this.files[`files[${newDoc.file_index}]`] = file;
			delete newDoc.file_path;
		} else if (newDoc.file_data) {
			// File data is used
			if (!has.call(newDoc, 'file_index')) {
				// Find current index
				const index = this.bundleData.documents.filter((doc) => has.call(doc, 'file_index')).length;

				newDoc.file_index = index;
			}
			const file = new File([newDoc.file_data], 'file-from-data.pdf');
			this.files[`files[${newDoc.file_index}]`] = file;
			delete newDoc.file_data;
		}

		this.bundleData.documents.push(newDoc);
		return newDoc.key;
	};

	addDocumentByPath = (filePath, additionalFields = {}) => {
		return this.#addDocument({'file_path': filePath, ...additionalFields});
	};

	addDocumentByUrl = (fileURL, additionalFields = {}) => {
		return this.#addDocument({'file_url': fileURL, ...additionalFields});
	};

	addDocumentByFile = (fileData, additionalFields = {}) => {
		return this.#addDocument({'file_data': fileData, ...additionalFields});
	};

	/**
	 * Add a Document Template to the bundle.
	 * @param {Object} template - Must include valid template id from BlueInk Dashboard.
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
		if (has.call(template, 'assignments') && !Array.isArray(template.assignments)) {
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
		const signerIndex = this.bundleData.packets.findIndex((signer) => signer.key === signerKey);
		if (signerIndex === -1) throw new Error('Signer key is invalid.');

		// Find the template
		const template = this.bundleData.documents.find((template) => template.key === templateKey);
		if (!template) throw new Error('Document key is invalid.');
		if (!has.call(template, 'template_id')) {
			throw new Error(`Document with key ${templateKey} is not a template.`);
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
	 * @param {Object} newSigner
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
	 * @param {Object} newField - New Field
	 * @returns - Key of the Field.
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

		const document = this.bundleData.documents.find((doc) => doc.key === docKey);
		if (!document) {
			errors.push({
				field: 'docKey',
				message: `Document with key ${docKey} is invalid.`,
			});
		}
		if (has.call(newField, 'editors') && !Array.isArray(newField.editors)) {
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
	 * Set Document value
	 * @param {string} docKey 
	 * @param {string} key 
	 * @param {*} value 
	 */
	setValue = (docKey, key, value) => {
		const document = this.bundleData.documents.find((doc) => doc.key === docKey);
		if (!document) {
			throw new Error(`Document with key ${docKey} is invalid.`)
		}
		document[key] = value;
		return document;
	}

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

export default BundleHelper;