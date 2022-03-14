const { sampleBundle, sample2 } = require("../../seed/sample");
const { generateKey } = require("../../util/utility");
const fs = require("fs");
const path = require('path');
// const FormData = require("form-data");
const { FormData } = require("formdata-node");
const has = Object.prototype.hasOwnProperty;
const { fileFromPathSync } = require("formdata-node/file-from-path");
// const {FormData} = require('formdata-node');
const { Readable } = require("stream");
const { Encoder, FormDataEncoder } = require("form-data-encoder");
const FILE_PATH = path.resolve('./fw9.pdf');
const utilities = require("../../util/utility");

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

class BundleHelper {
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

		// File path is used;
		if (newDoc.file_path) {
			// Find current index
			const index = this.bundleData.documents.filter((doc) =>
				has.call(doc, "file_index")
			).length;
			newDoc.file_index = index;
			const file = fileFromPathSync(newDoc.file_path);
			// this.formData.append("bundle_request", JSON.stringify(sample2));
			// Form Data will store all of the files
			this.files[`files[${index}]`] = file

			delete newDoc.file_path;
		}

		this.bundleData.documents.push(newDoc);
		return newDoc.key;
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
		if (!newField.kind) throw new Error("kind is required.");
		if (!kinds.includes(newField.kind)) throw new Error("kind is invalid.");
		if (!newField.key) newField.key = generateKey("field");

		// We will provide them default x, y, w, h?
		if (!newField.x) newField.x = 15;
		if (!newField.y) newField.y = 60;
		if (!newField.w) newField.w = 20;
		if (!newField.h) newField.h = 3;
		const document = this.bundleData.documents.find(
			(doc) => doc.key === docKey
		);
		document.fields.push(newField);
		return newField.key;
	};

	asData = () => {
		// File is attached
		if (!utilities.isEmpty(this.files)) {
			const form = new FormData();
			for (let key in this.files) {
				form.append(key, this.files[key]);
			}
			form.append("bundle_request", JSON.stringify(this.bundleData));
			const encoder = new FormDataEncoder(form)
			return {data: Readable.from(encoder), headers: encoder.headers};
		}
		return this.bundleData
	};
}

module.exports = BundleHelper;
