const sampleBundle = require("../seed/sample");
const axios = require("../config/axios/axios");
require('dotenv').config();

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
	#defaultBaseUrl = "https://api.blueink.com/api/v2";
	#baseApiUrl;
	constructor(privateApiKey, baseApiUrl) {
		// Define Private Key
		if (privateApiKey) {
			this.#privateApiKey = privateApiKey;
		} else {
			this.#privateApiKey = process.env.BLUE_INK_PRIVATE_KEY
		}

		// Define Base URL
		if (baseApiUrl) {
			this.#baseApiUrl = baseApiUrl
		}
		if (!this.baseApiUrl) {
			this.#baseApiUrl = process.env.BLUE_INK_API_URI;
		}
		if (!this.#baseApiUrl) {
			this.#baseApiUrl = this.#defaultBaseUrl;
		}

		axios.interceptors.request.use((config) => {
			config.headers.Authorization = `Token ${this.#privateApiKey}`;
			config.baseURL = this.#baseApiUrl
			return config;
		});
	}

	#post = (path, data) => {
		return axios.post(path, data);
	};

	#get = (path, query = {}) => {
		const params = new URLSearchParams(query).toString();
		return axios.get(`${path}?${params}`);
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


	bundles = {
		create: (data = initBundle) => this.#post("/bundles/", data),
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
