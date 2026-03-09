require('dotenv/config');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { Client, BundleHelper } = require('../../index');

const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY);

const askField = async (field) => {
	let get_field = '';
	while (!get_field) {
		const answer = await inquirer.prompt({
			name: field,
			type: 'input',
		});
		get_field = answer[field];
	}
	return get_field;
};

const listEnvelopeTemplates = async () => {
	console.log(chalk.blue('\n📋 Fetching available Envelope Templates...\n'));
	try {
		const response = await client.envelopeTemplates.list();

		if (!response.data || response.data.length === 0) {
			console.log(chalk.yellow('⚠️  No envelope templates found in your account.'));
			return [];
		}

		console.log(chalk.green(`✓ Found ${response.data.length} envelope template(s):\n`));
		console.log(chalk.gray('─'.repeat(80)));

		response.data.forEach((template, index) => {
			console.log(chalk.cyan(`${index + 1}. ${template.name || 'Unnamed Template'}`));
			console.log(chalk.gray(`   ID: ${template.id}`));
			if (template.description) {
				console.log(chalk.gray(`   Description: ${template.description}`));
			}
			console.log(chalk.gray('─'.repeat(80)));
		});

		return response.data;
	} catch (error) {
		console.log(chalk.red('✗ Error fetching envelope templates:'));
		if (error.response) {
			console.log(error.response.data);
		} else {
			console.log(error.message);
		}
		return [];
	}
};

const askEnvelopeTemplateId = async (templates) => {
	if (templates.length === 0) {
		console.log(chalk.yellow('\nNo templates available. Please enter a template ID manually.'));
		return await askField('envelope_template_id');
	}

	const choices = templates.map((template) => ({
		name: `${template.name || 'Unnamed Template'} (ID: ${template.id})`,
		value: template.id,
	}));

	choices.push({
		name: chalk.gray('Enter a different template ID manually'),
		value: 'manual',
	});

	const answer = await inquirer.prompt({
		name: 'envelope_template_id',
		type: 'list',
		message: 'Select an Envelope Template:',
		choices: choices,
	});

	if (answer.envelope_template_id === 'manual') {
		return await askField('envelope_template_id');
	}

	return answer.envelope_template_id;
};

const createBundleFromEnvelopeTemplate = async () => {
	try {
		const requester_email = await askField('requester_email');
		const bundleHelper = new BundleHelper({
			requester_email,
			label: 'New Bundle Created Using Envelope Template',
			requester_name: 'Mr. Example',
			email_subject: 'Yay First Bundle',
			email_message: 'This is your first bundle.',
		});
		console.log('Test Bundle Data is added using BundleHelper Class. \n');

		// List all available envelope templates
		const templates = await listEnvelopeTemplates();

		// Ask user to select a template
		const envelope_template_id = await askEnvelopeTemplateId(templates);

		bundleHelper.addEnvelopeTemplate({
			template_id: envelope_template_id,
		});
		console.log('Test Envelope Template is added using BundleHelper Class. \n');

		const signer1 = bundleHelper.addSigner({
            key: 'signer-1',
			name: 'The Signer One',
			email: 'peter.gibbons@example.com',
		});
		console.log('Test Signer is added using BundleHelper Class. \n');

		console.log('Creating a new Bundle.');

		const response = await client.bundles.createFromBundleHelper(bundleHelper);
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

createBundleFromEnvelopeTemplate();

