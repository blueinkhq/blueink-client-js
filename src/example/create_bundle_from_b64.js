require('dotenv/config');
const inquirer = require('inquirer');
const chalk = require('chalk');
const fetch = require('node-fetch');
const { Client, BundleHelper } = require('../../index');
const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY);

const createBundleFromUrl = async () => {
	try {
		const requester_email = await askRequesterEmail();
		const bundleHelper = new BundleHelper({
			label: 'New Bundle Created Using File Base64',
			requester_email: requester_email,
			requester_name: 'Mr. Example',
			email_subject: 'Yay First Bundle',
			email_message: 'This is your first bundle.',
		});
		console.log('Test Bundle Data is added using BundleHelper Class. \n');

		const file_url = await askFileUrl();
		const file_b64 = await pdfUrlToBase64(file_url)
		const file_name = "test_bundle_b64"
		
		const docKey1 = bundleHelper.addDocumentByB64(file_name, file_b64, {
			key: 'DOC-1',
		});
		console.log('Test Document is added using BundleHelper Class. \n');

		const signer1 = bundleHelper.addSigner({
			name: 'The Signer One',
			email: 'peter.gibbons@example.com',
		});
		console.log('Test Signer is added using BundleHelper Class. \n');

		const field = bundleHelper.addField(docKey1, {
			label: 'Your Name',
			page: 1,
			kind: 'txt',
			editors: [signer1],
			x: 15,
			y: 60,
			w: 20,
			h: 3,
		});
		console.log('Test Field is added using BundleHelper Class. \n');
		console.log('Creating a new Bundle.');

		const response = await client.bundles.create(bundleHelper.asData());
		console.log(
			chalk.bgGreen.black(
				`Bundle ${response.data.id} was created successfully.`
			)
		);
		console.log(response.data);
	} catch (error) {
		if (error.response) {
			console.log(error.response);
			console.log(chalk.bgRed.white('\nError: '), error.response.data);
		} else {
			console.log(error);
		}
	}
};

const askRequesterEmail = async () => {
	console.log('\nEnter Requester Email');
	let requester_email = '';
	while (!requester_email) {
		const answer = await inquirer.prompt({
			name: 'requester_email',
			type: 'input',
		});
		requester_email = answer.requester_email;
	}
	return requester_email;
};

const askFileUrl = async () => {
	console.log('\nEnter a File URL which is converted to Base64');
	const answer = await inquirer.prompt({
		name: 'file_url',
		type: 'input',
		default() {
			return 'https://www.irs.gov/pub/irs-pdf/fw4.pdf';
		},
	});
	return answer.file_url;
};

async function pdfUrlToBase64(pdfUrl) {
	try {
		// Fetch the PDF file from the URL
		const response = await fetch(pdfUrl);
		
		// Check if the request was successful (status code 200)
		if (!response.ok) {
		throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
		}
		
		// Get the PDF content as an array buffer
		const pdfArrayBuffer = await response.arrayBuffer();
		
		// Convert the array buffer to a base64 string
		const base64String = btoa(
		new Uint8Array(pdfArrayBuffer)
			.reduce((data, byte) => data + String.fromCharCode(byte), '')
		);
		
		return base64String;
	} catch (error) {
		console.log('Error:', error.message);
		return null;
	}
}

createBundleFromUrl();
