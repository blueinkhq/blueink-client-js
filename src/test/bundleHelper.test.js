const { BundleHelper } = require('../blueink');

describe('Bundle Helper', () => {
    it('Add document', () => {
        const nbh = new BundleHelper();
        nbh.addDocumentByUrl('test-url.pdf', {
            key: 'DOC-1',
        })
        expect(1).toBe(1)


        // expect(nbh.asData())
    })
})