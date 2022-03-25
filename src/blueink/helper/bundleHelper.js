import { FormDataEncoder } from "form-data-encoder";
import { FormData, File } from "formdata-node";
import { fileFromPathSync } from "formdata-node/file-from-path";
import { Readable } from "stream";
import { sampleBundle } from "../../seed/sample.js";
import { generateKey } from "../../util/utility.js";
import isEmpty from "lodash.isempty";
const has = Object.prototype.hasOwnProperty;

const kinds = [
	"att",
	"cbx",
	"chk",
	"dat",
	"ini",
	"inp",
	"sdt",
	"sel",
	"sig",
	"sum",
	"txt",
];

export class BundleHelper {
	constructor(newBundleData) {
		// Initialize bundle
		this.bundleData = { ...sampleBundle, ...newBundleData };

		// Store the file info and will return it as FormData when the asData method get called.
		this.files = {};
	}

	addDocument = (newDoc) => {
		const key = generateKey("doc");
		if (!newDoc.key) newDoc.key = key;
		if (!newDoc.fields) newDoc.fields = [];

		if (
			!has.call(newDoc, "file_path") &&
			!has.call(newDoc, "file_url") &&
			!has.call(newDoc, "file_data")
		) {
			throw [
				{
					field: "file_path/file_url/file_data",
					message: "This field must not be blank.",
				},
			];
		}

		// File path is used
		if (newDoc.file_path) {
			if (!has.call(newDoc, "file_index")) {
				// Find current index
				const index = this.bundleData.documents.filter((doc) =>
					has.call(doc, "file_index")
				).length;

				newDoc.file_index = index;
			}

			const file = fileFromPathSync(newDoc.file_path);

			// Form Data will store all of the files
			this.files[`files[${newDoc.file_index}]`] = file;
			delete newDoc.file_path;
		} else if (newDoc.file_data) {
			// File data is used
			if (!has.call(newDoc, "file_index")) {
				// Find current index
				const index = this.bundleData.documents.filter((doc) =>
					has.call(doc, "file_index")
				).length;

				newDoc.file_index = index;
			}
			const file = new File([newDoc.file_data], "file-from-data.pdf");
			this.files[`files[${newDoc.file_index}]`] = file;
			delete newDoc.file_data;
		}

		this.bundleData.documents.push(newDoc);
		return newDoc.key;
	};

	addDocumentTemplate = (template) => {
		const error = [];
		const noBlankMessage = "This field must not be blank.";
		if (!template.key) template.key = generateKey("tem");

		// Check template_id
		if (!template.template_id) {
			error.push({
				field: "template_id",
				message: noBlankMessage,
			});
		}

		// Check assignments
		if (
			has.call(template, "assignments") &&
			!Array.isArray(template.assignments)
		) {
			error.push({
				field: "assignments",
				message: "This field must be an array",
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
				message: "This field must be an array.",
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

	assignRole = (signerKey, templateKey, roleId) => {
		// Check if signer exists
		const signerIndex = this.bundleData.packets.findIndex(
			(signer) => signer.key === signerKey
		);
		if (signerIndex === -1) throw new Error("Signer key is invalid.");

		// Find the template
		const template = this.bundleData.documents.find(
			(template) => template.key === templateKey
		);
		if (!template) throw new Error("Document key is invalid.");
		if (!has.call(template, "template_id")) {
			throw new Error(`Document with key ${templateKey} is not a template.`);
		}
		if (!template.assignments || !Array.isArray(template.assignments)) {
			template.assignments = [{ role: roleId, signer: signerKey }];
		} else {
			template.assignments.push({ role: roleId, signer: signerKey });
		}
		return template;
	};

	addSigner = (newSigner) => {
		const key = generateKey("signer");
		if (!newSigner.key) {
			newSigner.key = key;
		}
		this.bundleData.packets.push(newSigner);
		return newSigner.key;
	};

	// Field only need for DocumentRequest
	addField = (docKey, newField) => {
		const errors = [];
		const noBlankMessage = "This field must not be blank.";

		const requiredFields = ["kind", "x", "y", "w", "h"];
		requiredFields.forEach((field) => {
			if (!newField[field]) {
				errors.push({
					field,
					message: noBlankMessage,
				});
			}
		});

		if (!kinds.includes(newField.kind)) {
			errors.push({
				field: "kind",
				message: "kind is invalid.",
			});
		}
		if (!newField.key) newField.key = generateKey("field");

		const document = this.bundleData.documents.find(
			(doc) => doc.key === docKey
		);
		if (!document) {
			errors.push({
				field: "docKey",
				message: `Document with key ${docKey} is invalid.`,
			});
		}
		if (has.call(newField, "editors") && !Array.isArray(newField.editors)) {
			errors.push({
				field: "editors",
				message: "This field must be an array",
			});
		}

		if (!isEmpty(errors)) throw errors;

		document.fields.push(newField);
		return newField.key;
	};

	asData = () => {
		// File is attached
		if (!isEmpty(this.files)) {
			const form = new FormData();
			for (let key in this.files) {
				form.append(key, this.files[key]);
			}
			form.append("bundle_request", JSON.stringify(this.bundleData));
			const encoder = new FormDataEncoder(form);
			return { data: Readable.from(encoder), headers: encoder.headers };
		}
		return this.bundleData;
	};
}
