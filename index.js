const BlueInkClient = require("./src/blueink/index.js");
const sampleBundle = require("./src/seed/sample");
const BundleHelper = require("./src/blueink/bundle/bundleHelper.js");
require("dotenv").config();
const axios = require("axios").default;

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
		const docKey1 = nbh.addDocument({
			key: "DOC-1",
			// file_url: "https://www.irs.gov/pub/irs-pdf/fw9.pdf",
			file_path: "fw9.pdf",
		});

		// const file =

		const signer1 = nbh.addSigner({
			name: "Testing",
			email: "peter.gibbons@example.com",
		});

		const field = nbh.addField(docKey1, {
			label: "Your Name",
			page: 1,
			kind: "txt",
			editors: [signer1],
		});


		// console.log(nbh.formData.getBuffer())

		// const res = await axios({
		// 	url: 'https://api.blueink.com/api/v2/bundles/',
		// 	data: nbh.formData,
		// 	method: 'POST',
		// 	headers: {
		// 		'Authorization': `Token ${process.env.BLUE_INK_PRIVATE_KEY}`,
		// 		...nbh.formData.getHeaders(),
		// 	}
		// })

		// console.log('res: ' ,res)
		// nbh.formData.submit(
		// 	{
		// 		host: "https://api.blueink.com/api/v2/bundles/",
		// 		// path: "",
		// 		headers: {
		// 			Authorization: `Token ${process.env.BLUE_INK_PRIVATE_KEY}`,
		// 		},
		// 	},
		// 	(err, res) => {
		// 		if (err) throw err;
		// 		console.log(res);
		// 	}
		// );

		// console.log(nbh.asData());
		// const res = await client.bundles.create(nbh.asData());
		// console.log(res.status)
	} catch (e) {
		console.log(e.response);
	}
};

callApi();

module.exports = client;
