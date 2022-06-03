import "dotenv/config";
import { BundleHelper } from "../blueink/index.js";
import { Client } from "../blueink/index.js";
import inquirer from "inquirer";
import chalk from "chalk";

const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY);

const createBundleFromUrl = async () => {
	try {
		const requester_email = await askRequesterEmail();
		const bundleHelper = new BundleHelper({
			label: "New Bundle Created Using File URL",
			requester_email: requester_email,
			requester_name: "Mr. Example",
			email_subject: "Yay First Bundle",
			email_message: "This is your first bundle.",
		});
		console.log("Test Bundle Data is added using BundleHelper Class. \n");

		const file_url = await askFileUrl();
		const docKey1 = bundleHelper.addDocumentByUrl(file_url, {
			key: "DOC-1",
		});
		console.log("Test Document is added using BundleHelper Class. \n");

		const signer1 = bundleHelper.addSigner({
			name: "The Signer One",
			email: "peter.gibbons@example.com",
		});
		console.log("Test Signer is added using BundleHelper Class. \n");

		const field = bundleHelper.addField(docKey1, {
			label: "Your Name",
			page: 1,
			kind: "txt",
			editors: [signer1],
			x: 15,
			y: 60,
			w: 20,
			h: 3,
		});
		console.log("Test Field is added using BundleHelper Class. \n");
		console.log("Creating a new Bundle.");

		const response = await client.bundles.create(bundleHelper.asData());
		console.log(
			chalk.bgGreen.black("Your Bundle has been created successfully.")
		);
		console.log(response);
	} catch (error) {
		if (error.response) {
			console.log(error.response);
			console.log(chalk.bgRed.white("\nError: "), error.response.data);
		} else {
			console.log(error);
		}
	}
};

const askRequesterEmail = async () => {
	console.log("\nEnter Requester Email");
	let requester_email = "";
	while (!requester_email) {
		const answer = await inquirer.prompt({
			name: "requester_email",
			type: "input",
		});
		requester_email = answer.requester_email;
	}
	return requester_email;
};

const askFileUrl = async () => {
	console.log("\nEnter a File URL");
	const answer = await inquirer.prompt({
		name: "file_url",
		type: "input",
		default() {
			return "https://www.irs.gov/pub/irs-pdf/fw4.pdf";
		},
	});
	return answer.file_url;
};

createBundleFromUrl();
