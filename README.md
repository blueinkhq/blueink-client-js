# blueink-client-js

Javascript Client for the BlueInk API

## Installation

Use `npm` to install the Blueink Javascript Library

```
npm install blueink-client-js
```

## How do I import the client and other helpers from the Library?

**Recommended:** You can import the client in ES module style if your environment supports it:

```js
import { BlueInkClient } from "blueink-client-js";
```

Or you can import the client in CommonJS style:

```js
const { BlueInkClient } = require("blueink-client-js");
```

## How do I initialize the client?

```js
import { BlueInkClient } from "blueink-client-js";

const client = new BlueInkClient("Your-BlueInk-Private-Api-Key");
```

If your **BlueInk Private API Key** is not provided, the library will look for `BLUEINK_PRIVATE_API_KEY` in the `.env`.

You can also pass the URL to BlueInk API Call explicitly to the client:

```js
const client = new BlueInkClient("Your-BlueInk-Private-Api-Key", "BlueInk-URL");
```

Otherwise, it will check for the URL in `.env` file or use the default one.

## Usage

```js
import { BlueInkClient } from "blueink-client-js";

/*
Create an instance of the API Client
and initialize it with the credentials
*/
const client = new BlueInkClient(process.env.BLUEINK_PRIVATE_API_KEY);

//Create wrapper async function
const listAllBundles = async () => {
	// The try/catch statement needs to be called from within an asynchronous function
	try {
		// Call bundles.list methods to get all bundles in the BlueInk account
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
		// Call bundles.list methods to get all bundles in the BlueInk account
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

```js
import { BlueInkClient, BundleHelper } from "blueink-client-js";

const client = new BlueInkClient(process.env.BLUEINK_PRIVATE_API_KEY);

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

		// Adding a new document is easy with addDocument method
		const docKey = bundleHelper.addDocument({
			key: "DOC-1", // key will be generated automatically if not provided
			file_path: "path-to-your-file.pdf",
			// or
			// file_url: 'some-url.pdf'
		});

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
