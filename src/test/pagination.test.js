import { client } from "../../index.js";

describe("Pagination", () => {
	it("Iterator", async () => {
		const pageList = await client.bundles.pagedList({
			page: 2,
			per_page: 20,
		});
		let i = 2;
		for (let page of pageList.pages) {
			++i;
			const pageData = await page;
			expect(pageData.currentPage).toBe(i);
		}
	});

	it("Get Next Page", async () => {
		const pageList = await client.bundles.pagedList({
			page: 2,
			per_page: 20,
		});
		const nextPage = await pageList.nextPage();
		expect(nextPage.currentPage).toBe(3);
	});

	it("Get Previous Page", async () => {
		const pageList = await client.bundles.pagedList({
			page: 3,
			per_page: 20,
		});
		const nextPage = await pageList.previousPage();
		expect(nextPage.currentPage).toBe(2);
	});
});
