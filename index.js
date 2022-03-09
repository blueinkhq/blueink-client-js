const BlueInkClient = require("./src/BlueInk");
const sampleBundle = require("./src/seed/sample");
require('dotenv').config();

// Sample API Call
const client = new BlueInkClient(process.env.BLUE_INK_PRIVATE_KEY);

const callApi = async () => {
	try {
		const nbh = client.createBundleHelper({
			label: 'some label',
			email_subject: 'some subject',
		})
		// console.log(nbh.asData())
		const bundleList = await client.bundles.list({
			status__in: 'co'
		});
		console.log(bundleList.data)
        // const newBundle = await client.bundles.create(nbh.asData());
		// console.log(newBundle)
		// const bundleData = await client.bundles.listData('w5cpHdvRoN');
		// console.log('bundle: ', bundleData)
		// await client.bundles.cancel('lB949j38QI')
	} catch (e) {
		// console.log(e)
	}
};

// callApi();


module.exports = client;
