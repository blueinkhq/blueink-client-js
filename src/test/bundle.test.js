import { client } from "../../index.js";

describe("Bundles", () => {

	it("List all Bundles", async () => {
		const { status, data } = await client.bundles.list({ status: "co" });
		expect(status).toBe(200);
	});

	it("Retrieve a Bundle", async () => {
		const { status, data } = await client.bundles.retrieve(sentBundleId);
		expect(status).toBe(200);
	});

	it("List Bundle Events", async () => {
		const { status, data } = await client.bundles.listEvents(sentBundleId);
		expect(status).toBe(200);
	});

	it("List Completed Bundle Data", async () => {
		const { status, data } = await client.bundles.listData(completedBundleId);
		expect(status).toBe(200);
	});
});
