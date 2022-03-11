const {sampleBundle, sample2} = require("../../seed/sample");
const { generateKey } = require("../../util/utility");
const fs = require("fs");
const FormData = require("form-data");
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
		this.formData = new FormData();
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
            console.log('path', newDoc.file_path)
			const file = fs.createReadStream('./fw9.pdf');
            // console.log(file)
            file.on('data', () => {
                console.log('open')
            })
			delete newDoc.file_path;
			this.formData.append("bundle_request", JSON.stringify(sample2));
			this.formData.append(`file[0}]`, file);
			// console.log(this.formData)
            // const a = this.formData.getHeaders();
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

	asData = () => this.bundleData;
}

module.exports = BundleHelper;
