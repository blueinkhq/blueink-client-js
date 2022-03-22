import "dotenv/config";
import { BundleHelper } from "../blueink/bundle/bundleHelper.js";
import { BlueInkClient } from "../blueink/index.js";
import inquirer from "inquirer";
import chalk from "chalk";

const client = new BlueInkClient(process.env.BLUEINK_PRIVATE_API_KEY);

console.log(chalk.bgBlue.white("Listing Bundles is easy \n"));

const askAction = async () => {
	const answer = await inquirer.prompt({
		name: "action",
		type: "list",
		message: "Choose an action to continue",
		choices: ["List Bundles", "List Bundles with Pagination"],
	});
	return answer.action;
};

const askRelatedData = async () => {
	const answer = await inquirer.prompt({
		name: "related_data",
		type: "confirm",
		message: "Do you want related data?",
	});
	return answer.related_data;
};

const askPagination = async () => {
	const { page } = await inquirer.prompt({
		name: "page",
		type: "number",
		message: "Page number",
		default() {
			return 1;
		},
	});
	const { per_page } = await inquirer.prompt({
		name: "per_page",
		type: "number",
		message: "Number of result per page",
		default() {
			return 1;
		},
	});
	return {
		page,
		per_page,
	};
};

const askFetchPage = async (page) => {
	const { answer } = await inquirer.prompt({
		name: "answer",
		type: "confirm",
		message: `Do you want to fetch the ${page} page?`,
	});
	return answer;
};

const listBundles = async () => {
	try {
		const action = await askAction();
		const related_data = await askRelatedData();

		switch (action) {
			case "List Bundles": {
				// Regular list with default 50 results per page.
				const response = await client.bundles.list({
					related_data,
				});
				console.log(response);
				break;
			}
			case "List Bundles with Pagination": {
				const pagination = await askPagination();

				// Example how to paged list.
				const response = await client.bundles.pagedList({
					related_data,
					page: pagination.page,
					per_page: pagination.per_page,
				});
				console.log(response);

				let next_page = true;
				while (next_page) {
					next_page = await askFetchPage("next");
					if (next_page) {
						// Fetch the next page by calling nextPage();
						const nextPageResponse = await response.nextPage();
						console.log(chalk.bgGreen.black("Fetch Next Page Successfully."));
						console.log(nextPageResponse);
					}
				}

				let previous_page = true;
				while (previous_page) {
					previous_page = await askFetchPage("previous");
					if (previous_page) {
						// Fetch the previous page by calling previousPage();
						const previousPageResponse = await response.previousPage();
						console.log(
							chalk.bgGreen.black("Fetch Previous Page Successfully.")
						);
						console.log(previousPageResponse);
					}
				}

				break;
			}
		}

		console.log(chalk.bgGreen.black("List Bundles Successfully."));
	} catch (error) {
		console.log(chalk.bgRed.white("\nError: "));
		if (error.response) {
			console.log(error.response);
			console.log(error.response.data);
		} else {
			console.log(error);
		}
	}
};

listBundles();
// askAction();
