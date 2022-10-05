const { BundleHelper } = require('../blueink');

describe('Bundle Helper', () => {
	it('Add document', () => {
		const nbh = new BundleHelper({
			label: 'New Bundle 1',
			requester_email: "requester@sample.com",
			requester_name: 'Mr. Example',
			email_subject: 'Yay First Bundle',
			email_message: 'This is your first bundle.',
		});
		nbh.addDocumentByUrl('test-url.pdf', {
			key: 'DOC-1',
		});
        console.log(nbh.asData().documents.length )

		expect(nbh.asData().documents.length).toBe(1);

        const nbh2 = new BundleHelper({
			label: 'New Bundle 2',
			requester_email: "requester2@sample.com",
			requester_name: 'Mr. Example 2',
			email_subject: 'Yay First Bundle 2',
			email_message: 'This is your second bundle.',
		});
        
		nbh2.addDocumentByUrl('another-url.pdf', {
			key: 'DOC-2',
		});

		expect(nbh2.asData().documents.length).toBe(1);
		expect(nbh.asData().documents.length).toBe(1);
	});
});
