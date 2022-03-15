import {BlueInkClient} from './src/blueink/index.js'
import {BundleHelper} from "./src/blueink/bundle/bundleHelper.js";
import 'dotenv/config'


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
			file_url: "https://www.irs.gov/pub/irs-pdf/fw4.pdf",
		});


		const signer1 = nbh.addSigner({
			name: "Testing",
			email: "peter.gibbons@example.com",
		});

		const field = nbh.addField(docKey1, {
			label: "Your Name",
			page: 1,
			kind: "txt",
			editors: [signer1],
			x: 15,
			y: 60,
			w: 20,
			h: 3,
		});

		const dockey2 = nbh.addDocument({
			key: 'DOC-2',
			file_path: './fw9.pdf',
		})

		nbh.addField(dockey2, {
			label: "Your Name",
			page: 1,
			kind: "txt",
			editors: [signer1],
			x: 15,
			y: 60,
			w: 20,
			h: 3,
		})


		const res = await client.bundles.create(nbh.asData());
		console.log(res.status)
	} catch (e) {
		if (e.response) {
			console.log(e.response)
			console.log(e.response.data.errors)
		}
		else {
			console.log(e);
		}
	}
};

callApi();

// module.exports = client;
export {client}