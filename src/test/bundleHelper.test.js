const BundleHelper = require('../blueink/helper/bundleHelper');

const DOCUMENT_PATH = "fw9.pdf"
const DOCUMENT_URL = "https://www.irs.gov/pub/irs-pdf/fw4.pdf"
const DOCUMENT_BASE64 = "JVBERi0xLjMKMyAwI"

describe('BundleHelper', () => {
    let bundleHelper;

    beforeEach(() => {
        bundleHelper = new BundleHelper();
    });

    describe('addDocumentByUrl', () => {
        it('should add a document by URL', () => {
            const fileURL = DOCUMENT_URL;
            const additionalFields = { key: 'DOC-1' };
            const result = bundleHelper.addDocumentByUrl(fileURL, additionalFields);
            expect(result).toEqual('DOC-1')
        });
    });

    describe('addDocumentByPath', () => {
        it('should add a document by path', () => {
            const fileData = DOCUMENT_PATH;
            const additionalFields = { key: 'DOC-2' };
            const result = bundleHelper.addDocumentByPath(fileData, additionalFields);
            expect(result).toEqual('DOC-2')
        });
    });

    describe('addDocumentByB64', () => {
        it('should add a document by base64 data', () => {
            const fileB64 = DOCUMENT_BASE64;
            const additionalFields = { key: 'DOC-3' };
            const result = bundleHelper.addDocumentByB64(fileB64, additionalFields);
            expect(result).toEqual('DOC-3')
        });
    });

    describe('addDocumentTemplate', () => {
        it('should add a document template', () => {
            const template = {
                key: 'tem-1',
                template_id: 'template-id',
                assignments: [{ role: 'signer', signer: 'signer-key' }],
                field_values: [{ key: 'field-key', value: 'field-value' }],
            };
            const result = bundleHelper.addDocumentTemplate(template);

            expect(result).toBeDefined();
            expect(bundleHelper.bundleData.documents).toContainEqual({
                ...template,
                key: result,
            });
        });

        it('should throw an error if template_id is missing', () => {
            const template = {};
            expect(() => bundleHelper.addDocumentTemplate(template)).toThrow();
        });

        it('should throw an error if assignments is not an array', () => {
            const template = { assignments: {} };
            expect(() => bundleHelper.addDocumentTemplate(template)).toThrow();
        });

        it('should throw an error if assignments is missing role or signer', () => {
            const template = { assignments: [{}] };
            expect(() => bundleHelper.addDocumentTemplate(template)).toThrow();
        });

        it('should throw an error if field_values is not an array', () => {
            const template = { field_values: {} };
            expect(() => bundleHelper.addDocumentTemplate(template)).toThrow();
        });

        it('should throw an error if field_values is missing key', () => {
            const template = { field_values: [{}] };
            expect(() => bundleHelper.addDocumentTemplate(template)).toThrow();
        });
    });

    describe('assignRole', () => {
        beforeEach(() => {
            bundleHelper.addSigner({ key: 'signer-key' });
            bundleHelper.addDocumentTemplate({ key: 'template-key', template_id: 'template-id' });
        });

        it('should assign a role to a signer', () => {
            const result = bundleHelper.assignRole('signer-key', 'template-key', 'signer');
            expect(result).toHaveProperty('assignments', [{ role: 'signer', signer: 'signer-key' }]);
        });

        it('should throw an error if signer key is invalid', () => {
            expect(() => bundleHelper.assignRole('invalid-key', 'template-key', 'signer')).toThrow();
        });

        it('should throw an error if document key is invalid', () => {
            expect(() => bundleHelper.assignRole('signer-key', 'invalid-key', 'signer')).toThrow();
        });

        it('should throw an error if document is not a template', () => {
            bundleHelper.addDocumentByUrl(DOCUMENT_URL);
            expect(() => bundleHelper.assignRole('signer-key', 'document-key', 'signer')).toThrow();
        });
    });

    describe('addSigner', () => {
        it('should add a signer', () => {
            const newSigner = { name: 'John Doe' };
            const result = bundleHelper.addSigner(newSigner);
            expect(result).toBeDefined();
            expect(bundleHelper.bundleData.packets).toContainEqual({
                ...newSigner,
                key: result,
            });
        });
    });

    describe('addField', () => {
        beforeEach(() => {
            bundleHelper.addDocumentByPath(DOCUMENT_PATH, { key: 'document-key' })
        });

        it('should add a field to the document', () => {
            const newField = { kind: 'txt', x: 10, y: 10, w: 100, h: 50 };
            const result = bundleHelper.addField('document-key', newField);
            expect(result).toBeDefined();
            expect(bundleHelper.bundleData.documents[bundleHelper.bundleData.documents.length -1].fields).toContainEqual({
                ...newField,
                key: result,
            });
        });

        it('should throw an error if required fields are missing', () => {
            const newField = { kind: 'txt' };
            expect(() => bundleHelper.addField('tem-1', newField)).toThrow();
        });

        it('should throw an error if kind is invalid', () => {
            const newField = { kind: 'invalid', x: 0, y: 0, w: 100, h: 50 };
            expect(() => bundleHelper.addField('tem-1', newField)).toThrow();
        });

        it('should throw an error if document key is invalid', () => {
            const newField = { kind: 'text', x: 0, y: 0, w: 100, h: 50 };
            expect(() => bundleHelper.addField('invalid-key', newField)).toThrow();
        });

        it('should throw an error if editors is not an array', () => {
            const newField = { kind: 'text', x: 0, y: 0, w: 100, h: 50, editors: {} };
            expect(() => bundleHelper.addField('tem-1', newField)).toThrow();
        });
    });

    describe('setValue', () => {
        beforeEach(() => {
            bundleHelper.addDocumentByPath(DOCUMENT_PATH, { key: 'document-key' })
        });

        it('should set a document value', () => {
            const result = bundleHelper.setValue('document-key', 'name', 'Document');
            expect(result).toHaveProperty('name', 'Document');
        });

        it('should throw an error if document key is invalid', () => {
            expect(() => bundleHelper.setValue('invalid-key', 'name', 'Document')).toThrow();
        });
    });

    describe('asData', () => {
        it('should return bundle data', () => {
            const result = bundleHelper.asData();
            expect(result).toEqual(bundleHelper.bundleData);
        });

        it('should return bundle data with files', () => {
            bundleHelper.files = { file: Buffer.from('file data') };
            const result = bundleHelper.asData();
            expect(result).toHaveProperty('data');
            expect(result).toHaveProperty('headers');
        });
    });
});
