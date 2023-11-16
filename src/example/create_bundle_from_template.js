require('dotenv/config');
const chalk = require('chalk');
const inquirer = require('inquirer');

const { Client, BundleHelper } = require('../../index');

const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY);

const createBundleFromTemplate = async () => {
	try {
		const requester_email = await askRequesterEmail();
		const bundleHelper = new BundleHelper({
			label: 'New Bundle Created Using Template',
			email_subject: 'Yay First Bundle',
			email_message: 'This is your first bundle.',
			requester_name: 'Mr. Example',
			requester_email,
		});
		console.log('Test Bundle Data is added using BundleHelper Class. \n');

		const template_id = await askTemplateId();
		const templateKey = bundleHelper.addDocumentTemplate({
			template_id,
		});
		console.log('Test Template is added using BundleHelper Class. \n');

		const signer1 = bundleHelper.addSigner({
			name: 'The Signer One',
			email: 'peter.gibbons@example.com',
		});
		console.log('Test Signer is added using BundleHelper Class. \n');

		const roleId = await askRoleId();
		bundleHelper.assignRole(signer1, templateKey, roleId);

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

const askTemplateId = async () => {
	console.log('\nEnter a Template ID');
	const answer = await inquirer.prompt({
		name: 'template_id',
		type: 'input',
		default() {
			return '';
		},
	});
	return answer.template_id;
};

const askRoleId = async () => {
	console.log('\nEnter a Role ID');
	const answer = await inquirer.prompt({
		name: 'role_id',
		type: 'input',
		default() {
			return '';
		},
	});
	return answer.role_id;
};

createBundleFromTemplate();
