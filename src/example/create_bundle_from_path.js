require('dotenv/config');
const { Client, BundleHelper } = require('../../index');
const inquirer = require('inquirer');
const chalk = require('chalk');

const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY);

const createBundleFromPath = async () => {
	try {
		const requester_email = await askRequesterEmail();
		const bundleHelper = new BundleHelper({
			label: 'New Bundle Created Using File Path',
			requester_email: requester_email,
			requester_name: 'Mr. Example',
			email_subject: 'Yay First Bundle',
			email_message: 'This is your first bundle.',
		});
		console.log('Test Bundle Data is added using BundleHelper Class. \n');

		const file_path = await askFilePath();
		const docKey1 = bundleHelper.addDocumentByPath(file_path, {
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

const askFilePath = async () => {
	console.log('\nEnter a File Path');
	const answer = await inquirer.prompt({
		name: 'file_path',
		type: 'input',
		default() {
			return './src/example/fw9.pdf';
		},
	});
	return answer.file_path;
};

createBundleFromPath();
