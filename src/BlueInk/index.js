const sampleBundle = require("../seed/sample");
const has = Object.prototype.hasOwnProperty;
const axios = require("../config/axios/axios");

/*
Trade off between object and data
Object: 
    Pro:
    - Can call method to do some action without id parameter
    - Easy to use?
    - Semantic
    Con:
    - Document might be complicated since having more methods
    - Take longer to implement
    - Might be difficult to pass the Object between modules/components

Data: 
    Pro:
    - Easier to implement
    - Neat document
    - Can call API anywhere with ID
    Cons:
    - Require parameters for each action
*/

class BlueInkClient {
	#privateApiKey;

	constructor(privateApiKey) {
		this.base_api_url = "https://api.blueink.com/api/v2";
		this.#privateApiKey = privateApiKey;
		axios.interceptors.request.use((config) => {
			config.headers.Authorization = `Token ${this.#privateApiKey}`;
			return config;
		});
	}

	#post = (path, data) => {
		return axios.post(path, data);
	};

	#get = (path) => {
		return axios.get(path);
	};

	#put = (path, data = {}) => {
		return axios.put(path, data);
	};

	#delete = (path, data) => {
		return axios({
			url: path,
			method: "DELETE",
			data: data,
		});
	};

	#patch = (path, data) => {
		return axios.patch(path, data);
	};

	createBundleHelper = (bundleData) => {
		let data = { ...sampleBundle };
		for (const [key, value] of Object.entries(bundleData)) {
			if (has.call(sampleBundle, key)) {
				data[key] = value;
			}
		}

		const addSigner = (newSigner) => {
			// Might do some data validation
			data.packets.push(newSigner);
		};

		const validate = () => {
			const errors = [];

			if (data.packets.length === 0) {
				errors.push({
					field: "packets",
					message: "packets must be provided",
				});
			}
			if (data.documents.length === 0) {
				errors.push({
					field: "documents",
					message: "documents must be provided",
				});
			}

            // for (let i in data.packets) {
            //     if (!data.packets[i].key.trim())
            // }
		};

		return {
			asData: () => data,
			addSigner,
			validate,
		};
	};

	bundles = {
		create: (data) => this.#post("/bundles/", data),
		list: (query) => this.#get("/bundles/", query),
		retrieve: (bundleId) => this.#get(`/bundles/${bundleId}/`),
		cancel: (bundleId) => this.#put(`/bundles/${bundleId}/cancel/`),
		listEvents: (bundleId) => this.#get(`/bundles/${bundleId}/events/`),
		listFiles: (bundleId) => this.#get(`/bundles/${bundleId}/files/`),
		listData: (bundleId) => this.#get(`/bundles/${bundleId}/data/`),
	};

	persons = {
		create: (data) => this.#post("/persons/", data),
		list: (query) => this.#get("/persons/", query),
		retrieve: (personId) => this.#get(`/persons/${personId}/`),
	};
}

module.exports = BlueInkClient;
