import {instance as axios} from '../config/axios/axios.js'
import 'dotenv/config';
const has = Object.prototype.hasOwnProperty;

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
	#bundlesPath = '/bundles';
	#personsPath = '/persons';
	#packetsPath = '/packets';
	#templatesPath = '/templates';
	constructor(privateApiKey, baseApiUrl) {
		// Define Private Key
		this.#privateApiKey = privateApiKey || process.env.BLUEINK_PRIVATE_KEY;

		// Define Base URL
		this.#baseApiUrl =
			baseApiUrl || process.env.BLUEINK_API_URI || this.#baseApiUrl;

		axios.interceptors.request.use((config) => {
			config.headers.Authorization = `Token ${this.#privateApiKey}`;
			config.baseURL = this.#baseApiUrl;
			return config;
		});
	}

	#post = (path, data) => {
		if (has.call(data, "headers")) {
			return axios.post(path, data.data, {
				headers: {
					...data.headers,
				},
			});
		}
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
		create: (data = initBundle) => this.#post(`${this.#bundlesPath}/`, data),
		list: (query) => this.#get(`${this.#bundlesPath}/`, query),
		retrieve: (bundleId) => this.#get(`${this.#bundlesPath}/${bundleId}/`),
		cancel: (bundleId) => this.#put(`${this.#bundlesPath}/${bundleId}/cancel/`),
		listEvents: (bundleId) => this.#get(`${this.#bundlesPath}/${bundleId}/events/`),
		listFiles: (bundleId) => this.#get(`${this.#bundlesPath}/${bundleId}/files/`),
		listData: (bundleId) => this.#get(`${this.#bundlesPath}/${bundleId}/data/`),
	};

	persons = {
		create: (data) => this.#post(`${this.#personsPath}/`, data),
		list: (query) => this.#get(`${this.#personsPath}/`, query),
		retrieve: (personId) => this.#get(`${this.#personsPath}/${personId}/`),
		update: (personId, data) => this.#put(`${this.#personsPath}/${personId}/`, data),
		partialUpdate: (personId, data) => this.#patch(`${this.#personsPath}/${personId}/`, data),
		delete: (personId) => this.#delete(`${this.#personsPath}/${personId}/`)
	};

	packets = {
		update: (packetId, data) => this.#patch(`${this.#packetsPath}/${packetId}`, data),
		remind: (packetId) => this.#put(`${this.#packetsPath}/${packetId}/remind/`),
		retrieveCOE: (packetId) => this.#get(`${this.#packetsPath}/${packetId}/coe/`),
	};

	templates = {
		list: (query) => this.#get(`${this.#templatesPath}/`, query),
		retrieve: (templateId) => this.#get(`${this.#templatesPath}/${templateId}/`),
	}
}

export {BlueInkClient}
