import { client } from "../../index.js";

describe("Templates", () => {
	it("List all Templates", async () => {
		const { status, data } = await client.templates.list();
		return expect(status).toBe(200);
	});

	it("Retrieve a Template", async () => {
		const templateId = "5703cfb0-970d-4950-b6d0-9f9d70d9168f";
		const { status, data } = await client.templates.retrieve(templateId);
		expect(status).toBe(200);
	});
    
});
