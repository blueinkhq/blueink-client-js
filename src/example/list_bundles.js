import chalk from "chalk";
import "dotenv/config";
import inquirer from "inquirer";
import { Client } from "../blueink/index.js";

const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY);

console.log(chalk.bgBlue.white("Listing Bundles is easy \n"));

const askAction = async () => {
	const answer = await inquirer.prompt({
		name: "action",
		type: "list",
		message: "Choose an action to continue",
		choices: ["List Bundles", "List Bundles with Pagination", "List Bundles using Iterator"],
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

/*
EXAMPLE of Listing Bundles
Same methods are applied to Persons and Templates
*/

const listBundles = async () => {
	try {
		const action = await askAction();
		const related_data = await askRelatedData();

		switch (action) {
			case "List Bundles": {
				// Regular list with default 50 results per page.
				const response = await client.bundles.list({
					related_data, //bool
				});
				console.log(response);
				break;
			}
			case "List Bundles with Pagination": {
				const pagination = await askPagination();

				// Example how to paged list.
				const response = await client.bundles.pagedList({
					related_data, //bool
					page: pagination.page,
					per_page: pagination.per_page,
				});
				console.log(response);

				let next_page = true;
				while (next_page) {
					next_page = await askFetchPage("next");
					if (next_page) {
						// Fetch the next page by calling nextPage();
						const nextPageResponse = await response.pagination.nextPage();
						console.log(chalk.bgGreen.black("Fetch Next Page Successfully."));
						console.log(nextPageResponse);
					}
				}

				let previous_page = true;
				while (previous_page) {
					previous_page = await askFetchPage("previous");
					if (previous_page) {
						// Fetch the previous page by calling previousPage();
						const previousPageResponse = await response.pagination.previousPage();
						console.log(
							chalk.bgGreen.black("Fetch Previous Page Successfully.")
						);
						console.log(previousPageResponse);
					}
				}

				break;
			}
			case "List Bundles using Iterator": {
				const pagination = await askPagination();

				// Example how to fetch bundles using iterator
				const response = await client.bundles.pagedList({
					related_data, //bool
					page: pagination.page,
					per_page: pagination.per_page,
				});
				
				for (let page of response.pagination.pages) {
					console.log(await page);
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
