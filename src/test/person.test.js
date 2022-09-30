require('dotenv/config');
const { Client } = require('../../index');

const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY);

describe("Persons", () => {
	let newPersonId = "";

	it("List all Persons", async () => {
		const { status, data } = await client.persons.list();
		expect(status).toBe(200);
	});

	it("Retrieve a Person", async () => {
		const personId = "1ca04018-2996-454b-a938-412bcd5168da";

		const { status, data } = await client.persons.retrieve(personId);
		expect(status).toBe(200);
		expect(data.name).toBe("Test Account");
	});

	it("Create a Person", async () => {
		const { status, data } = await client.persons.create({
			name: "Peter Parker",
			metadata: {
				occupation: "legend",
			},
			channels: [
				{
					email: "tom.jones@example.com",
					kind: "em",
				},
				{
					phone: "505 555 1234",
					kind: "mp",
				},
			],
		});
		expect(status).toBe(201);
		newPersonId = data.id;
	});

	it("Update a Person", async () => {
		const { status, data } = await client.persons.update(newPersonId, {
			name: "Tony Stark",
			metadata: {
				occupation: "singer",
			},
			channels: [
				{
					email: "tommyj@example.com",
					kind: "em",
				},
			],
		});
		expect(status).toBe(200);
	});

	it("Partial Update a Person", async () => {
		const { status, data } = await client.persons.update(newPersonId, {
			name: "Tom Jones",
			metadata: {
				occupation: "singer",
			},
			channels: [
				{
					email: "tommyj2@example.com",
					kind: "em",
				},
			],
		});
		expect(status).toBe(200);
	});

	it("Delete a Person", async () => {
		const { status, data } = await client.persons.delete(newPersonId);
		expect(status).toBe(204);
	});
});
