require('dotenv/config');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { Client, BundleHelper } = require('../../index');

const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY);

/**
 * Example: Create a Bundle with Auto Placement of Fields
 * 
 * This example demonstrates how to use the Auto Placement feature to automatically
 * place fields on your PDFs based on specific string inputs. The system will detect
 * strings like "Tenant Signature" or "Landlord Date" and automatically place the
 * corresponding fields next to them.
 * 
 * This is particularly useful for documents where the exact location of fields may vary,
 * but the strings indicating where they should be placed remain consistent.
 */
const createBundleWithAutoPlacement = async () => {
	try {
		const requester_email = await askRequesterEmail();
		
		// Create a new bundle
		const bundleHelper = new BundleHelper({
			label: 'Bundle with Auto Placement Fields',
			requester_email: requester_email,
			requester_name: 'Mr. Example',
			email_subject: 'Please Sign This Document',
			email_message: 'This document uses auto-placement to automatically position signature fields.',
		});
		console.log(chalk.blue('✓ Bundle data created using BundleHelper\n'));

		// Add document from URL
		const file_url = await askFileUrl();
		const docKey = bundleHelper.addDocumentByUrl(file_url, {
			key: 'DOC-1',
		});
		console.log(chalk.blue('✓ Document added to bundle\n'));

		// Add signers
		const tenantSigner = bundleHelper.addSigner({
			name: 'John Tenant',
			email: requester_email,
		});
		console.log(chalk.blue(`✓ Tenant signer added (key: ${tenantSigner})`));

		const landlordSigner = bundleHelper.addSigner({
			name: 'Jane Landlord',
			email: requester_email,
		});
		console.log(chalk.blue(`✓ Landlord signer added (key: ${landlordSigner})\n`));

		// Use AutoPlacementHelper to create auto-placement configurations
		const AutoPlacement = BundleHelper.AutoPlacement;

		// Add auto-placement for Tenant Signature
		// This will search for "Signature" in the PDF and place a signature field there
		const tenantSigPlacement = AutoPlacement.createSignature('signature')
			.setHeight(3)
			.setWidth(25)
			.setOffsetY(2)  // Offset 2 units below the search string
			.addEditor(tenantSigner);
		
		bundleHelper.addAutoPlacement(docKey, tenantSigPlacement.getConfig());
		console.log(chalk.green('✓ Auto-placement added: Tenant Signature field'));

		// Add auto-placement for Tenant Date
		const tenantDatePlacement = AutoPlacement.createDate('Date')
			.setHeight(3)
			.setWidth(25)
			.setOffsetY(2)
			.addEditor(tenantSigner);
		
		bundleHelper.addAutoPlacement(docKey, tenantDatePlacement.getConfig());
		console.log(chalk.green('✓ Auto-placement added: Tenant Date field'));

		// You can also add other types of auto-placements:
		// - Text fields: AutoPlacement.createText('Search String')
		// - Checkboxes: AutoPlacement.createCheckbox('Search String')
		// - Initials: AutoPlacement.createInitial('Search String')

		// Create the bundle
		console.log(chalk.yellow('Creating bundle with auto-placement fields...\n'));
		const response = await client.bundles.create(bundleHelper.asData());
		
		console.log(
			chalk.bgGreen.black(
				`\n✓ Bundle ${response.data.id} was created successfully!\n`
			)
		);
		console.log(chalk.cyan('Bundle Details:'));
		console.log(chalk.gray('─'.repeat(50)));
		console.log(`ID: ${response.data.id}`);
		console.log(`Label: ${response.data.label}`);
		console.log(`Status: ${response.data.status}`);
		console.log(`Documents: ${response.data.documents.length}`);
		console.log(`Signers: ${response.data.packets.length}`);
		console.log(chalk.gray('─'.repeat(50)));
		console.log('\nFull response:');
		console.log(JSON.stringify(response.data, null, 2));
	} catch (error) {
		if (error.response) {
			console.log(chalk.bgRed.white('\n✗ Error occurred:\n'));
			console.log(chalk.red('Status:'), error.response.status);
			console.log(chalk.red('Data:'), JSON.stringify(error.response.data, null, 2));
		} else if (Array.isArray(error)) {
			console.log(chalk.bgRed.white('\n✗ Validation errors:\n'));
			error.forEach((err) => {
				console.log(chalk.red(`  - ${err.field}: ${err.message}`));
			});
		} else {
			console.log(chalk.bgRed.white('\n✗ Error:\n'));
			console.log(error);
		}
	}
};

const askRequesterEmail = async () => {
	console.log(chalk.yellow('\nEnter Requester Email:'));
	let requester_email = '';
	while (!requester_email) {
		const answer = await inquirer.prompt({
			name: 'requester_email',
			type: 'input',
			message: 'Email:',
		});
		requester_email = answer.requester_email;
	}
	return requester_email;
};

const askFileUrl = async () => {
	console.log(chalk.yellow('\nEnter a File URL:'));
	console.log(chalk.gray('(The PDF should contain text like "Tenant Signature", "Tenant Date", "Landlord Signature", "Landlord Date")'));
	const answer = await inquirer.prompt({
		name: 'file_url',
		type: 'input',
		message: 'URL:',
		default() {
			return 'https://www.irs.gov/pub/irs-pdf/fw4.pdf';
		},
	});
	return answer.file_url;
};

// Run the example
createBundleWithAutoPlacement();

