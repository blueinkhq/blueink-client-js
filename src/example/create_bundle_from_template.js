import "dotenv/config";
import { BundleHelper } from "../blueink/helper/bundleHelper.js";
import { Client } from "../blueink/index.js";
import inquirer from "inquirer";
import chalk from "chalk";

const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY);

const askField = async (field) => {
	let get_field = "";
	while (!get_field) {
		const answer = await inquirer.prompt({
			name: field,
			type: "input",
		});
		get_field = answer[field];
	}
	return get_field;
};

const createBundleFromTemplate = async () => {
	try {
		const requester_email = await askField("requester_email");
		const bundleHelper = new BundleHelper({
			requester_email,
			label: "New Bundle Created Using Template",
			requester_name: "Mr. Example",
			email_subject: "Yay First Bundle",
			email_message: "This is your first bundle.",
		});
		console.log("Test Bundle Data is added using BundleHelper Class. \n");

		const template_id = await askField("template_id");

		const templateKey = bundleHelper.addDocumentTemplate({
			template_id,
		});
		console.log("Test Template is added using BundleHelper Class. \n");

		const signer1 = bundleHelper.addSigner({
			name: "The Signer One",
			email: "peter.gibbons@example.com",
		});
		console.log("Test Signer is added using BundleHelper Class. \n");

		const role_id = await askField("role_id");
		bundleHelper.assignRole(signer1, templateKey, role_id);

		console.log("Creating a new Bundle.");

		const response = await client.bundles.create(bundleHelper.asData());
		console.log(chalk.bgGreen.black(`Bundle ${response.data.id} was created successfully.`));
		console.log(response.data);
	} catch (error) {
		if (error.response) {
			console.log(error.response);
			console.log(chalk.bgRed.white("\nError: "), error.response.data);
		} else {
			console.log(error);
		}
	}
};

createBundleFromTemplate();
