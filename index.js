const BlueInkClient = require("./src/blueink/index.js");
const sampleBundle = require("./src/seed/sample");
const BundleHelper = require("./src/blueink/bundle/bundleHelper.js");
require("dotenv").config();
const axios = require("axios").default;
const {Readable} = require('stream');
const fetch = require('node-fetch')
const { Encoder, FormDataEncoder } = require("form-data-encoder");



// Sample API Call
const client = new BlueInkClient(process.env.BLUE_INK_PRIVATE_KEY);

const callApi = async () => {
	try {
		const nbh = new BundleHelper({
			label: "Test Label",
			requester_email: "tps.reports@example.com",
			requester_name: "Mr. Example",
			email_subject: "Yay First Bundle",
			email_message: "This is your first bundle.",
		});
		// const docKey1 = nbh.addDocument({
		// 	key: "DOC-1",
		// 	file_url: "https://www.irs.gov/pub/irs-pdf/fw4.pdf",
		// 	// file_path: "fw9.pdf",
		// });


		const signer1 = nbh.addSigner({
			name: "Testing",
			email: "peter.gibbons@example.com",
		});

		// const field = nbh.addField(docKey1, {
		// 	label: "Your Name",
		// 	page: 1,
		// 	kind: "txt",
		// 	editors: [signer1],
		// });

		const dockey2 = nbh.addDocument({
			key: 'DOC-2',
			file_path: './fw9.pdf',
		})

		nbh.addField(dockey2, {
			label: "Your Name",
			page: 1,
			kind: "txt",
			editors: [signer1],
		})


		// const res = await client.bundles.create(nbh.asData());
		// console.log(res.status)
	} catch (e) {
		if (e.response) {
			console.log(e.response)
		}
		else {
			console.log(e);
		}
	}
};

callApi();

module.exports = client;
