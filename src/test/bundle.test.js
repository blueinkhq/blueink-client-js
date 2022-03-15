import {client} from '../../index.js';

describe("Bundles", () => {
	const sentBundleId = "w5cpHdvRoN";
	const completedBundleId = "ReGx0JSafZ";
	const canceledBundleId = "e1aswoGKQ9";

	it("List all Bundles", () => {
		console.log(client)
		return client.bundles.list({status: 'co'}).then((res) => expect(res.status).toBe(200));
	});

	it("Retrieve a Bundle", () => {
		return client.bundles
			.retrieve(sentBundleId)
			.then((res) => expect(res.status).toBe(200));
	});

	it("List Bundle Events", () => {
		return client.bundles
			.listEvents(sentBundleId)
			.then((res) => expect(res.status).toBe(200));
	});

	it("List Sent Bundle Data - Expect to be Error with code 'Conflict'", () => {
		return client.bundles
			.listData(sentBundleId)
			.then((res) => expect(res.status).toBe(200))
			.catch((err) => expect(err.response.data.code).toBe("conflict"));
	});

	it("List Completed Bundle Data - Expect to be Error with code 'Conflict'", () => {
		return client.bundles
			.listFiles(completedBundleId)
			.then((res) => expect(res.status).toBe(200))
			.catch((err) => expect(err.response.data.code).toBe("conflict"));
	});

	it("List Completed Bundle Data", () => {
		return client.bundles
			.listData(completedBundleId)
			.then((res) => expect(res.status).toBe(200));
	});

	it("Cancel a Bundle(Fail) - Expect to be Error with code '400'", () => {
		return client.bundles
			.cancel(canceledBundleId)
			.then((res) => expect(res.status).toBe(200))
			.catch((err) => expect(err.response.status).toBe(400));
	});
});


