# blueink-client-js

Javascript Client for the Blueink API
## Overview

This README provides a narrative overview of using the Blueink Javascript client, and
includes examples for many common use cases.

Additional resources that might be useful include:

* Examples at [blueink-client-js-examples](https://github.com/blueinkhq/blueink-client-js/tree/main/src/example)
repo on GitHub.
* The detailed [Blueink API Documentation](https://blueink.com/r/api-docs/), for
  details on the data returned by each API call.

For detailed documentation for each method call, please consult the source code,
or rely on auto-complete in your favorite editor / IDE. The code is well commented and
includes Javascript type annotations, which most IDEs understand.

## Installation

Use `npm` to install the Blueink Javascript Library

```
npm install blueink-client-js
```

## How do I import the client and other helpers from the Library?

**Recommended:** You can import the client in ES module style if your environment supports it:

```js
import { Client } from "blueink-client-js";
```

Or you can import the client in CommonJS style:

```js
const { Client } = require("blueink-client-js");
```

## How do I initialize the client?

```js
import { Client } from "blueink-client-js";

const client = new Client("Your-Blueink-Private-Api-Key");
```

If your **Blueink Private API Key** is not provided, the library will look for `BLUEINK_PRIVATE_API_KEY` in the `.env`.

You can also pass the URL to Blueink API Call explicitly to the client:

```js
const client = new Client("Your-Blueink-Private-Api-Key", "Blueink-URL");
```

Otherwise, it will check for the URL in `.env` file or use the default one.

## Usage

```js
import { Client } from "blueink-client-js";

/*
Create an instance of the API Client
and initialize it with the credentials
*/
const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY);

//Create wrapper async function
const listAllBundles = async () => {
	// The try/catch statement needs to be called from within an asynchronous function
	try {
		// Call bundles.list methods to get all bundles in the Blueink account
		const bundleList = await client.bundles.list();

		console.log("Here is your all bundles: ", bundleList);

		// Get the bundles with status co (complete)
		const completedBundleList = await client.bundles.list({
			status: "co",
		});

		console.log("Here is your all completed bundles: ", completedBundleList);
	} catch (error) {
		if (error.response) {
			console.log("There was an error in your request: ", error.response);
		} else {
			console.log("Unexpected Error: ", error);
		}
	}
};

// Invokes the async function
listAllBundles();
```

We provide the paged list where it has a generator function so you can fetch the next or previous page just using `nextPage` or `previousPage` methods

```js
import { BlueInkClient } from "blueink-client-js";

const client = new BlueInkClient(process.env.BLUEINK_PRIVATE_API_KEY);

const pagedListAllBundles = async () => {
	try {
		// Call bundles.list methods to get all bundles in the Blueink account
		// Passing the related_data will fetch bundle's events, data, files at once
		const pagedList = await client.bundles.pagedList({
			page: 5,
			per_page: 10,
			related_data: true,
		});

		console.log(
			"Here is your all bundles with related data at page 5: ",
			pagedList
		);

		// To get the rest of the pages, we use iterator
		for (let page of pagedList.pages) {
			const currentPageData = await page;
			console.log("Your current page: ", currentPageData);
		}

		// Simply and fast fetch the next page using nextPage method
		const nextPageData = await pagedList.nextPage();

		console.log("Here is your next page data: ", nextPageData);

		// Similarly, fetching previous page is simple enough
		const previousPageData = await pagedList.previousPage();

		console.log("Here is your previous page data: ", previousPageData);
	} catch (error) {
		// Error handling
		if (error.response) {
			console.log("There was an error in your request: ", error.response);
		} else {
			console.log("Unexpected Error: ", error);
		}
	}
};

// Invokes the async function
pagedListAllBundles();
```

Creating a new Bundle can be tedious and complex. Therefore, we provide `BundleHelper` which helps you to create a new bundle with less error prone.
To create a new bundle, we can either use `addDocumentByPath`, `addDocumentByUrl`, `addDocumentByFile`.


```js
import { Client, BundleHelper } from "blueink-client-js";

const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY);

const createNewBundle = async () => {
	try {
		// Initialize the BundleHelper with basic bundle information
		const bundleHelper = new BundleHelper({
			label: "New Bundle Created Using File Path",
			requester_email: "example@email.com",
			requester_name: "Mr. Example",
			email_subject: "Yay First Bundle",
			email_message: "This is your first bundle.",
		});

		// Adding a new document is easy with addDocument* method
		const docKey = bundleHelper.addDocumentByPath("path-to-your-file.pdf", {
			key: "DOC-1", // key will be generated automatically if not provided
		});

		/* Adding a new document url
		const docKey = bundleHelper.addDocumentByUrl("url-to-pdf-file", {
			key: "DOC-1", // key will be generated automatically if not provided
		});
		*/

		/* Adding a new document file
		const docKey = bundleHelper.addDocumentByFile(file, {
			key: "DOC-1", // key will be generated automatically if not provided
		});
		*/

		// Add a new signer to your bundle
		const signerKey = bundleHelper.addSigner({
			name: "The Signer One",
			email: "peter.gibbons@example.com",
		});

		// Add a new field to your document and assign it to the signer
		bundleHelper.addField(docKey, {
			label: "Your Name",
			page: 1,
			kind: "txt",
			editors: [signerKey],
			x: 15,
			y: 60,
			w: 20,
			h: 3,
		});

		// We also provide addDocumentTemplate
		const templateKey = bundleHelper.addDocumentTemplate({
			template_id: "Your-template-id-here",
		});

		bundleHelper.assignRole(signerKey, templateKey, "your-role-id");

		// Finally, call create method from the client to create a new bundle
		const newBundleData = await client.bundles.create(bundleHelper.asData());

		console.log("Creating a new bundle is easy: ", newBundleData);
	} catch (error) {
		if (error.response) {
			console.log("There was an error in your request: ", error.response);
		} else {
			console.log("Unexpected Error: ", error);
		}
	}
};

// Invokes the async function
createNewBundle();
```
## Client Method Index
Parameters can be found using autocomplete within your IDE. Creates/Updates take a
Javascript dictionary as the data field.

### Bundle Related
* Create via ```client.bundles.create(...)``` or ```client.bundles.createFromBundleHelper(...)```
* List via ```client.bundles.list(...)``` or ```client.bundles.pagedList(...)```
* Retrieve via ```client.bundles.retrieve(...)```
* Cancel via ```client.bundles.cancel(...)```
* List Events via ```client.bundles.listEvents(...)```
* List Files via ```client.bundles.listFiles(...)```
* List Data via ```client.bundles.listData(...)```

### Person Related
* Create via ```client.persons.create(...)``` or ```client.persons.createFromPersonHelper(...)```
* List via ```client.persons.list(...)``` or ```client.persons.pagedList(...)```
* Retrieve via ```client.persons.retrieve(...)```
* Delete via ```client.persons.delete(...)```
* Update via ```client.persons.update(...)```

### Packet Related
* Update via ```client.packets.update(...)```
* Create Embedded Signing URL via ```client.packets.embedUrl(...)```
* Retrieve COE via ```client.packets.retrieveCOE(...)```
* Remind via ```client.packets.remind(...)```

### Template Related
* List via ```client.templates.list(...)``` or ```client.templates.pagedList(...)```
* Retrieve via ```client.templates.retrieve(...)```

### Webhook Related

#### Webhook Client Methods
* Create via ```client.webhooks.create(...)```
* List via ```client.webhooks.list(...)```
* Retrieve via ```client.webhooks.retrieve(...)```
* Delete via ```client.webhooks.delete(...)```
* Update via ```client.webhooks.update(...)```

#### WebhookExtraHeader Client Methods
* Create via ```client.webhooks.createHeader(...)```
* List via ```client.webhooks.listHeaders(...)```
* Retrieve via ```client.webhooks.retrieveHeader(...)```
* Delete via ```client.webhooks.deleteHeader(...)```
* Update via ```client.webhooks.updateHeader(...)```

#### WebhookEvent Client Methods
* List via ```client.webhooks.listEvents(...)```
* Retrieve via ```client.webhooks.retrieveEvent(...)```

#### WebhookDelivery Client Methods
* List via ```client.webhooks.listDeliveries(...)```
* Retrieve via ```client.webhooks.retrieveDelivery(...)```

## Detailed Guide and Examples
### Bundles

#### Creating Bundles with the BundleHelper

When creating a Bundle via the API, you need to pass quite a bit of data in the
`client.bundle.create(...)` request. To ease the construction of that data, this
library provides a `BundleHelper` class.

Below is an example of using `BundleHelper` to create a Bundle with 1 document,
and 1 signers. In this example, the uploaded document is specified via a URL. [View full example](https://www.google.com)

```js
const client = new Client(BLUEINK_API_KEY);

const createBundleFromUrl = async () => {
	try {
		const bundleHelper = new BundleHelper({
			label: 'New Bundle Created Using File URL',
			requester_email: 'peter.griffin@gmail.com',
			requester_name: 'Mr. Peter',
			email_subject: 'Yay First Bundle',
			email_message: 'This is your first bundle.',
		});

		// # Add a document to the Bundle by providing a publicly accessible URL where
		// # the Blueink platform can download the document to include in the Bundle
		const fileUrl = "https://www.irs.gov/pub/irs-pdf/fw9.pdf"
		const docKey1 = bundleHelper.addDocumentByUrl(fileUrl, {
			key: 'DOC-1',
		});

		const signer1 = bundleHelper.addSigner({
			name: 'The Signer One',
			email: 'glenn.quagmire@gmail.com',
		});

		const field = bundleHelper.addField(docKey1, {
			label: 'Your Name',
			page: 1,
			kind: 'txt',
			editors: [signer1],
			x: 15,
			y: 60,
			w: 20,
			h: 3,
		});

		const response = await client.bundles.create(bundleHelper.asData());
		console.log(response.data);
	} catch (error) {
		if (error.response) {
			console.log(error.response);
		} else {
			console.log(error);
		}
	}
};
```
Using the BundleHelper, you can add files to a Bundle in multiple ways:
```js
const bh = new BundleHelper(...)

// 1) Add a document using a URL to a web resource:
docKey01 = bh.addDocumentByUrl("https://www.example.com/example.pdf")

// 2) Add a document using a path to the file in the local filesystem
docKey02 = bh.addDocumentByPath("/path/to/file/example.pdf")

// 3) Add a document using a UTF-8 encoded Base64 string:
const filename = 'test-sample'
const pdfB64 = 'JVBERi0xLjMKMyAwI...'
docKey03 = bh.addDocumentByB64(filename, pdfB64)
```
#### Retrieval

Getting a single bundle is fairly easy. They can be accessed with a single call. To get
the additional data (events, files, data), set the related_data flag to true.

```js
response = client.bundles.retrieve(bundleId, {related_data: true})
bundle = response.data

// # additional data fields (only exist if related_data is true)
events = bundle.events
files = bundle.files
data = bundle.data
```
#### Listing

Listing has several options regarding pagination. You can also choose to append the
additional data on each retrieved
bundle as you can with single fetches. ```client.bundles.pagedList()``` returns an
iterator object that lazy loads
subsequent pages. If no parameters are set, it will start at page 0 and have up to 50
bundles per page.

```js
// EXAMPLE: Collecting all bundle IDs
const pageIterator = client.bundles.pagedList({
	related_data, //bool
	page: pagination.page,
	per_page: pagination.per_page,
});
```
### Persons

Creating a person is similar to a creating a Bundle. There is a PersonHelper to help
create a person
```js
const client = new Client(BLUEINK_API_KEY)
const ph = new PersonHelper();

const personSampleUpdate = {
  name: 'Stewie Griffin',
  channels: []
};

// CREATE PERSON
function createPerson() {
	// Make up some metadata to add to the person
	const metadata = {
		number: 1,
		string: "stringy",
		dict: { number: 2 },
		list: [3]
	}
	//# Set the metadata of the person
	ph.setMetadata(metadata);

	// Set the persons name
	ph.setName("Brian Griffin");
	// Add email contacts for the person
	ph.addEmail("brian.griffin@gmail.com");
	ph.addEmail("stewie.griffin@gmail.com");

	// Get all of the emails for the person
	let allCurrentEmails = ph.getEmails();
	console.log("All Current Emails:", allCurrentEmails)

	// Remove an email from the list
	allCurrentEmails.splice(allCurrentEmails.indexOf("test@email.com"), 1);

	// Overwrite the existing email list with this new list
	// Effectively removing test@email.com list
	ph.setEmails(allCurrentEmails);

	// Add phone number contact for the person
	ph.addPhone("5055551212");
	ph.addPhone("5055551213");
	ph.addPhone("5055551214");

	// Get all of the phone numbers for the person
	let allCurrentPhones = ph.getPhones();
	console.log("All Current Phones:", allCurrentPhones)
	// Remove a phone number from the list
	allCurrentPhones.pop();

	// Overwrite the existing phone list with this new list
	// Effectively removing last phone number
	ph.setPhones(allCurrentPhones);

	createResp = await client.persons.createFromPersonHelper(ph);
	person = createResp.data;
	console.log(`Created person ${person.id}`);
}
// UPDATE PERSON
function updatePerson(personId) {
	const updateResp = await client.persons.update(
		personId,
		personSampleUpdate
	);
	person = updateResp.data;
	console.log(`Updated person ${JSON.stringify(person)}`);
}
// RETRIEVE PERSON
function retrievePerson(personId) {
	const retrieveResp = await client.persons.retrieve(personId);
	person = retrieveResp.data;
	console.log(`Retrieved person ${JSON.stringify(person)}`);
}
// DELETE PERSON
function deletePerson(personId) {
	const deleteResp = await client.persons.delete(personId);
	console.log(`Deleted person ${personId}`);
}
```
### Packets

Packets can be updated. Reminders may be triggered, and COEs can be retrieve using the
client:

```js
// Retrieve
client.packets.retrieve(packetId)

// Update
client.packets.update(packetId, payload)

// Remind
client.packets.remind(packetId)

// Get COE
client.packets.retrieveCOE(packetId)
```
### Templates

Templates can be listed (non-paged), listed (paged) or retrieved singly:

```js
// Non paged
const templatesListResponse = await client.templates.list();

// Paged
for await (const page of client.templates.pagedList()) {
  const templatesInPage = page.data;
  // Do something with templatesInPage
}

// Single
const templateResponse = await client.templates.retrieve(templateId);
```
### Webhooks

Webhooks can be interacted with via several methods. Webhooks also have related objects, such as
```WebhookExtraHeaders```, ```WebhookEvents```, and ```WebhookDeliveries``` which have their own
methods to interact with.
```js
const client = new Client(BLUEINK_API_KEY)
const webHookSample = {
  url: "https://www.example.com/01/",
  enable: true,
  json: true,
  event_types: [
    EVENT_TYPE.EVENT_BUNDLE_LAUNCHED,
    EVENT_TYPE.EVENT_PACKET_COMPLETE,
  ],
};

const webHookSampleUpdate = {
  url: "https://www.example.com/01/",
  enabled: false,
  event_types: [EVENT_TYPE.EVENT_PACKET_VIEWED],
};

const webHookSampleExtraHeader = {
  name: "Courage_The_Cowardly_Webhook",
  value: "Muriel Bagge",
  order: 0,
};

function createWebhook() {
	createResp = await client.webhooks.create(webHookSample);
	webhook = createResp.data;
	console.log(`Created webhook ${webhook.id}`);
}

function updateWebhook(webhookId) {
	const updateResp = await client.webhooks.update(
		webhookId,
		webHookSampleUpdate
	);
	webhook = updateResp.data;
	console.log(`Updated webhook ${webhook.id}`);
}

function createExtraHeader(webhookId) {
	const extraHeaderData = { ...webHookSampleExtraHeader };
	extraHeaderData["webhook"] = webhookId;
	const createHeaderResp = await client.webhooks.createHeader(
		extraHeaderData
	);
	header = createHeaderResp.data;
	console.log(
		`Added ExtraHeader ${JSON.stringify(header)} to ${header.webhook}`
	);
}

function listWebhooks() {
	const listResp = await client.webhooks.list();
	webhookList = listResp.data;
	console.log(`Found ${webhookList.length} Webhooks`);
	for (wh of webhookList) {
		console.log(` - Webhook ID: ${wh.id} to ${wh.url}`);
	}
}

function deleteWebhook(webhookId) {
	const webhookId = await askWebhookId();
	const deleteResp = await client.webhooks.delete(webhookId);
	console.log(`Deleted Webhook ${webhookId}`);
}
```

## Full Examples
To run the example:
```bash
npm run create-bundle-from-path
npm run create-bundle-from-url
npm run create-bundle-from-template
npm run create-bundle-from-b64
npm run list-bundles
npm run interact-persons
npm run interact-webhooks
```