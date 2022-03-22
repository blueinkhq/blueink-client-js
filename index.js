import { BlueInkClient } from "./src/blueink/index.js";
import { BundleHelper } from "./src/blueink/bundle/bundleHelper.js";
import { PaginationHelper } from "./src/blueink/pagination.js";
import "dotenv/config";

// Sample API Call
const client = new BlueInkClient(process.env.BLUEINK_PRIVATE_API_KEY);

const callApi = async () => {
	try {
		const nbh = new BundleHelper({
			label: "Test Label",
			requester_email: "tps.reports@example.com",
			requester_name: "Mr. Example",
			email_subject: "Yay First Bundle",
			email_message: "This is your first bundle.",
		});
		const docKey1 = nbh.addDocument({
			key: "DOC-1",
			file_url: "https://www.irs.gov/pub/irs-pdf/fw4.pdf",
		});

		const signer1 = nbh.addSigner({
			name: "Testing",
			email: "peter.gibbons@example.com",
		});

		const field = nbh.addField(docKey1, {
			label: "Your Name",
			page: 1,
			kind: "txt",
			editors: [signer1],
			x: 15,
			y: 60,
			w: 20,
			h: 3,
		});

		const dockey2 = nbh.addDocument({
			key: "DOC-2",
			file_path: "./fw9.pdf",
		});

		nbh.addField(dockey2, {
			label: "Your Name",
			page: 1,
			kind: "txt",
			editors: [signer1],
			x: 15,
			y: 60,
			w: 20,
			h: 3,
		});

		// const res = await client.bundles.list();
		const pagedList = await client.bundles.pagedList({
			page: 3,
			per_page: 50,
			related_data: true,
		});

		// const response = await client.bundles.retrieve("ReGx0JSafZ", {
		// 	related_data: true,
		// });
		// console.log("\n===> Bundle with Related Data", response.data);

		// console.log("\n ===> Iterative Function");
		// for (let page of pagedList.pages) {
		// 	const pageData = await page;
		// 	console.log("====> Current Page: ", pageData.currentPage);
		// }

		const nextPage = await pagedList.nextPage();
		// console.log(nextPage);
		const nextPage2 = await pagedList.nextPage();

		// console.log("\n===> Current Page: ", pagedList.currentPage);
		// console.log("=====> Next Page: ", nextPage.currentPage);
		// console.log("=====> Next Page: ", nextPage2.currentPage);

		// const previousPage = await pagedList.previousPage();
		// const previousPage2 = await pagedList.previousPage();
		// console.log("\n===> Current Page: ", pagedList.currentPage);
		// console.log("=====> Previous Page: ", previousPage.currentPage);
		// console.log("=====> Previous Page: ", previousPage2.currentPage);
	} catch (e) {
		if (e.response) {
			console.log(e.response);
			console.log(e.response.data);
		} else {
			console.log(e);
		}
	}
};

callApi();

export { client };
