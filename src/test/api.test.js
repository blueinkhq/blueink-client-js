const client = require("../../index");

describe("Bundles", () => {
	const sentBundleId = "w5cpHdvRoN";
	const completedBundleId = "ReGx0JSafZ";
	const canceledBundleId = "e1aswoGKQ9";

	it("List all Bundles", () => {
		return client.bundles.list().then((res) => expect(res.status).toBe(200));
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

describe('Persons', () => {
	const personId = '1ca04018-2996-454b-a938-412bcd5168da';
	it('List all Persons', () => {
		return client.persons.list().then(res => expect(res.status).toBe(200));
	});
	
	it('Retrieve a Person', () => {
		return client.persons.retrieve(personId).then(res => expect(res.data.name).toBe('Test Account'))
	})
})
