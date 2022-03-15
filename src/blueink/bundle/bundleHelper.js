import { FormDataEncoder } from "form-data-encoder";
import { FormData } from "formdata-node";
import { fileFromPathSync } from "formdata-node/file-from-path";
import { Readable } from "stream";
import { sampleBundle } from "../../seed/sample.js";
import { utilities } from "../../util/utility.js";
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

class BundleHelper {
	constructor(newBundleData) {
		// Initialize bundle
		this.bundleData = { ...sampleBundle, ...newBundleData };

		// Store the file info and will return it as FormData when the asData method get called.
		this.files = {};
	}

	addDocument = (newDoc) => {
		const key = utilities.generateKey("doc");
		if (!newDoc.key) newDoc.key = key;
		if (!newDoc.fields) newDoc.fields = [];

		// File path is used;
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
		}

		this.bundleData.documents.push(newDoc);
		return newDoc.key;
	};

	addSigner = (newSigner) => {
		const key = utilities.generateKey("signer");
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
		if (!newField.key) newField.key = utilities.generateKey("field");

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
			const encoder = new FormDataEncoder(form);
			return { data: Readable.from(encoder), headers: encoder.headers };
		}
		return this.bundleData;
	};
}

// module.exports = BundleHelper;
export { BundleHelper };
utilities.generateKey;
