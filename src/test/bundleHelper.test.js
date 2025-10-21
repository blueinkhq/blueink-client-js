const BundleHelper = require('../blueink/helper/bundleHelper');

const DOCUMENT_PATH = "src/example/fw9.pdf"
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
            const result = bundleHelper.addDocumentByB64('test', fileB64, additionalFields);
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

    // Auto Placement Tests
    describe('AutoPlacementHelper', () => {
        const AutoPlacementHelper = BundleHelper.AutoPlacement;

        it('Create a signature auto-placement', () => {
            const autoPlacement = AutoPlacementHelper.createSignature("Sign Here");
            const config = autoPlacement.getConfig();
            expect(config.kind).toBe("sig");
            expect(config.search).toBe("Sign Here");
        });

        it('Create a date auto-placement', () => {
            const autoPlacement = AutoPlacementHelper.createDate("Date");
            const config = autoPlacement.getConfig();
            expect(config.kind).toBe("sdt");
            expect(config.search).toBe("Date");
        });

        it('Create a text auto-placement', () => {
            const autoPlacement = AutoPlacementHelper.createText("Name");
            const config = autoPlacement.getConfig();
            expect(config.kind).toBe("txt");
            expect(config.search).toBe("Name");
        });

        it('Create a checkbox auto-placement', () => {
            const autoPlacement = AutoPlacementHelper.createCheckbox("Agree");
            const config = autoPlacement.getConfig();
            expect(config.kind).toBe("cbx");
            expect(config.search).toBe("Agree");
        });

        it('Create an initial auto-placement', () => {
            const autoPlacement = AutoPlacementHelper.createInitial("Initial");
            const config = autoPlacement.getConfig();
            expect(config.kind).toBe("ini");
            expect(config.search).toBe("Initial");
        });

        it('Set height on auto-placement', () => {
            const autoPlacement = AutoPlacementHelper.createSignature("Sign Here")
                .setHeight(10);
            const config = autoPlacement.getConfig();
            expect(config.h).toBe(10);
        });

        it('Set width on auto-placement', () => {
            const autoPlacement = AutoPlacementHelper.createSignature("Sign Here")
                .setWidth(50);
            const config = autoPlacement.getConfig();
            expect(config.w).toBe(50);
        });

        it('Set offset X on auto-placement', () => {
            const autoPlacement = AutoPlacementHelper.createSignature("Sign Here")
                .setOffsetX(5);
            const config = autoPlacement.getConfig();
            expect(config.offset_x).toBe(5);
        });

        it('Set offset Y on auto-placement', () => {
            const autoPlacement = AutoPlacementHelper.createSignature("Sign Here")
                .setOffsetY(2);
            const config = autoPlacement.getConfig();
            expect(config.offset_y).toBe(2);
        });

        it('Set editors on auto-placement', () => {
            const autoPlacement = AutoPlacementHelper.createSignature("Sign Here")
                .setEditors(["signer-1", "signer-2"]);
            const config = autoPlacement.getConfig();
            expect(config.editors).toEqual(["signer-1", "signer-2"]);
        });

        it('Add single editor to auto-placement', () => {
            const autoPlacement = AutoPlacementHelper.createSignature("Sign Here")
                .addEditor("signer-1")
                .addEditor("signer-2");
            const config = autoPlacement.getConfig();
            expect(config.editors).toEqual(["signer-1", "signer-2"]);
        });

        it('Chain multiple methods on auto-placement', () => {
            const autoPlacement = AutoPlacementHelper.createSignature("Sign Here")
                .setHeight(3)
                .setWidth(25)
                .setOffsetY(2)
                .addEditor("signer-1");
            const config = autoPlacement.getConfig();
            expect(config.kind).toBe("sig");
            expect(config.search).toBe("Sign Here");
            expect(config.h).toBe(3);
            expect(config.w).toBe(25);
            expect(config.offset_y).toBe(2);
            expect(config.editors).toEqual(["signer-1"]);
        });

        it('Throw error when kind is missing', () => {
            expect(() => {
                new AutoPlacementHelper({ search: "Sign Here" });
            }).toThrow();
        });

        it('Throw error when search is missing', () => {
            expect(() => {
                new AutoPlacementHelper({ kind: "sig" });
            }).toThrow();
        });

        it('Throw error when kind is invalid', () => {
            expect(() => {
                new AutoPlacementHelper({ kind: "invalid", search: "Sign Here" });
            }).toThrow();
        });

        it('Throw error when editors is not an array', () => {
            expect(() => {
                new AutoPlacementHelper({
                    kind: "sig",
                    search: "Sign Here",
                    editors: "signer-1"
                });
            }).toThrow();
        });

        it('Throw error when height is not a number', () => {
            expect(() => {
                new AutoPlacementHelper({
                    kind: "sig",
                    search: "Sign Here",
                    h: "10"
                });
            }).toThrow();
        });

        it('Throw error when width is not a number', () => {
            expect(() => {
                new AutoPlacementHelper({
                    kind: "sig",
                    search: "Sign Here",
                    w: "50"
                });
            }).toThrow();
        });
    });

    describe('addAutoPlacement', () => {
        const AutoPlacementHelper = BundleHelper.AutoPlacement;

        it('Add auto-placement to document', () => {
            const bundleHelper = new BundleHelper({
                label: "Test Bundle with Auto Placement",
                requester_email: "test@example.com",
                requester_name: "Test User",
            });

            const docKey = bundleHelper.addDocumentByUrl("https://example.com/test.pdf");
            const autoPlacement = AutoPlacementHelper.createSignature("Sign Here")
                .setHeight(3)
                .setWidth(25)
                .setOffsetY(2)
                .addEditor("signer-1");

            bundleHelper.addAutoPlacement(docKey, autoPlacement.getConfig());
            const doc = bundleHelper.bundleData.documents[0];
            expect(doc.auto_placements).toBeDefined();
            expect(doc.auto_placements.length).toBe(1);
            expect(doc.auto_placements[0].search).toBe("Sign Here");
        });

        it('Add multiple auto-placements to document', () => {
            const bundleHelper = new BundleHelper({
                label: "Test Bundle with Auto Placement",
                requester_email: "test@example.com",
                requester_name: "Test User",
            });

            const docKey = bundleHelper.addDocumentByUrl("https://example.com/test.pdf");

            const sigPlacement = AutoPlacementHelper.createSignature("Tenant Signature")
                .setHeight(3)
                .setWidth(25)
                .setOffsetY(2)
                .addEditor("signer-1");

            const datePlacement = AutoPlacementHelper.createDate("Tenant Date")
                .setHeight(3)
                .setWidth(25)
                .setOffsetY(2)
                .addEditor("signer-1");

            bundleHelper.addAutoPlacement(docKey, sigPlacement.getConfig());
            bundleHelper.addAutoPlacement(docKey, datePlacement.getConfig());

            const doc = bundleHelper.bundleData.documents[0];
            expect(doc.auto_placements.length).toBe(2);
            expect(doc.auto_placements[0].search).toBe("Tenant Signature");
            expect(doc.auto_placements[1].search).toBe("Tenant Date");
        });

        it('Throw error when adding auto-placement to invalid document', () => {
            const bundleHelper = new BundleHelper({
                label: "Test Bundle",
                requester_email: "test@example.com",
                requester_name: "Test User",
            });

            const autoPlacement = AutoPlacementHelper.createSignature("Sign Here");

            expect(() => {
                bundleHelper.addAutoPlacement("invalid-key", autoPlacement.getConfig());
            }).toThrow();
        });

        it('Throw error when adding auto-placement with invalid kind', () => {
            const bundleHelper = new BundleHelper({
                label: "Test Bundle",
                requester_email: "test@example.com",
                requester_name: "Test User",
            });

            const docKey = bundleHelper.addDocumentByUrl("https://example.com/test.pdf");

            expect(() => {
                bundleHelper.addAutoPlacement(docKey, {
                    kind: "invalid",
                    search: "Sign Here"
                });
            }).toThrow();
        });

        it('Throw error when adding auto-placement without search string', () => {
            const bundleHelper = new BundleHelper({
                label: "Test Bundle",
                requester_email: "test@example.com",
                requester_name: "Test User",
            });

            const docKey = bundleHelper.addDocumentByUrl("https://example.com/test.pdf");

            expect(() => {
                bundleHelper.addAutoPlacement(docKey, {
                    kind: "sig"
                });
            }).toThrow();
        });
    });
});
