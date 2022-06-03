import "dotenv/config";
import axios from "axios";

import { PaginationHelper } from "./helper/pagination.js";
import { DEFAULT_BASE_URL } from "./constants.js";

const has = Object.prototype.hasOwnProperty;

class Client {
    #privateApiKey;
    #defaultBaseUrl = DEFAULT_BASE_URL;
    #baseApiUrl;
    #bundlesPath = "/bundles";
    #personsPath = "/persons";
    #packetsPath = "/packets";
    #templatesPath = "/templates";

    /**
     * @param {string} privateApiKey
     * @param {string} [baseApiUrl]
     */
    constructor(privateApiKey, baseApiUrl) {
        // Define Private Key
        this.#privateApiKey = privateApiKey || process.env.BLUEINK_PRIVATE_API_KEY;

        // Define Base URL
        this.#baseApiUrl =
            baseApiUrl || process.env.BLUEINK_API_URI || this.#defaultBaseUrl;

        axios.defaults.baseURL = this.#baseApiUrl;
        axios.defaults.headers.common['Authorization'] = `Token ${this.#privateApiKey}`;
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

    #get = (path, params = {}) => {
        return axios.get(`${path}`, {
            params: params,
        });
    };

    #pagedList = async (path, params = {}) => {
        try {
            if (params.related_data === true) {
                const response = await this.#get(`${this.#bundlesPath}/`, params);
                response.data = await Promise.all(
                    response.data.map(async (bundle) => {
                        const related_data = await this.#getRelatedData(bundle);
                        return { ...bundle, related_data };
                    })
                );
                return new PaginationHelper(response, path, params, this);
            } else {
                const response = await axios.get(`${path}`, {
                    params: params,
                });
                return new PaginationHelper(response, path, params, this);
            }
        } catch (error) {
            throw error;
        }
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

    #getRelatedData = async (bundle) => {
        try {
            const related_data = {};
            related_data.events = await this.#get(
                `${this.#bundlesPath}/${bundle.id}/events/`
            );
            if (bundle.status === "co") {
                related_data.files = await this.#get(
                    `${this.#bundlesPath}/${bundle.id}/files/`
                );
                related_data.data = await this.#get(
                    `${this.#bundlesPath}/${bundle.id}/data/`
                );
            }
            return related_data;
        } catch (error) {
            throw error;
        }
    };

    bundles = {
        /**
         * Create new Bundle.
         * @param {object} data
         * @returns New Bundle data
         */
        create: (data) => this.#post(`${this.#bundlesPath}/`, data),

        /**
         * List all Bundles. Maximum 50 results per page.
         * @param {object} params
         * @returns All Bundles.
         */
        list: async (params = {}) => {
            if (params.related_data === true) {
                const response = await this.#get(`${this.#bundlesPath}/`, params);
                response.data = await Promise.all(
                    response.data.map(async (bundle) => {
                        const related_data = await this.#getRelatedData(bundle);
                        return { ...bundle, related_data };
                    })
                );
                return response;
            } else {
                return this.#get(`${this.#bundlesPath}/`, params);
            }
        },

        /**
         * Retrieve a Bundle.
         * @param {string} bundleId - The ID that uniquely identifies the Bundle.
         * @param {boolean} [options.related_data] - Get the related data of the Bundles (Events, Data, Files).
         * @returns Bundle Data
         */
        retrieve: async (bundleId, options = {}) => {
            if (options.related_data === true) {
                const response = await this.#get(`${this.#bundlesPath}/${bundleId}/`);
                const related_data = await this.#getRelatedData(response.data);
                response.data = { ...response.data, related_data };
                return response;
            } else {
                return this.#get(`${this.#bundlesPath}/${bundleId}/`);
            }
        },

        /**
         * Cancel a Bundle.
         * @param {string} bundleId - The ID that uniquely identifies the Bundle.
         */
        cancel: (bundleId) => this.#put(`${this.#bundlesPath}/${bundleId}/cancel/`),

        /**
         * Get a list of Events that are associated with the Bundle.
         * @param {string} bundleId - The ID that uniquely identifies the Bundle.
         */
        listEvents: (bundleId) =>
            this.#get(`${this.#bundlesPath}/${bundleId}/events/`),

        /**
         * Get downloadable files for a completed Bundle.
         * @param {string} bundleId - The ID that uniquely identifies the Bundle.
         */
        listFiles: (bundleId) =>
            this.#get(`${this.#bundlesPath}/${bundleId}/files/`),

        /**
         * Get data entered into fields for a completed Bundle.
         * @param {string} bundleId - The ID that uniquely identifies the Bundle.
         */
        listData: (bundleId) => this.#get(`${this.#bundlesPath}/${bundleId}/data/`),

        /**
         * Paged list Bundles.
         * @param {object} params
         * @param {number} [params.page]
         * @param {number} [params.per_page]
         * @returns {PaginationHelper} List of Bundles.
         */
        pagedList: (params) => this.#pagedList(`${this.#bundlesPath}/`, params),
    };

    persons = {
        /**
         * Create new Person.
         * @param {object} data
         * @returns New Person data
         */
        create: (data) => this.#post(`${this.#personsPath}/`, data),

        /**
         * List all Persons. Maximum 50 results per page.
         * @param {object} params
         * @returns All Persons.
         */
        list: (params = {}) => this.#get(`${this.#personsPath}/`, params),

        /**
         * Retrieve a Person.
         * @param {string} personId - The ID that uniquely identifies the Person.
         * @returns Person Data
         */
        retrieve: (personId) => this.#get(`${this.#personsPath}/${personId}/`),

        /**
         * Update a Person.
         * @param {string} personId - The ID that uniquely identifies the Person.
         * @param {object} data
         */
        update: (personId, data) =>
            this.#put(`${this.#personsPath}/${personId}/`, data),

        /**
         * Partial update a Person.
         * @param {string} personId - The ID that uniquely identifies the Person.
         * @param {object} data
         */
        partialUpdate: (personId, data) =>
            this.#patch(`${this.#personsPath}/${personId}/`, data),

        /**
         * Delete a Person.
         * @param {string} personId
         */
        delete: (personId) => this.#delete(`${this.#personsPath}/${personId}/`),

        /**
         * Paged list Persons.
         * @param {object} params
         * @param {number} [params.page]
         * @param {number} [params.per_page]
         * @returns {PaginationHelper} List of Persons.
         */
        pagedList: (params = {}) =>
            this.#pagedList(`${this.#bundlesPath}/`, params),
    };

    packets = {
        /**
         * Update a Packet
         * @param {string} packetId - The ID that uniquely identifies the Packet.
         * @param {object} data
         */
        update: (packetId, data) =>
            this.#patch(`${this.#packetsPath}/${packetId}`, data),

        /**
         * Send a Reminder email or SMS to a Signer.
         * @param {string} packetId - The ID that uniquely identifies the Packet.
         */
        remind: (packetId) => this.#put(`${this.#packetsPath}/${packetId}/remind/`),

        /**
         * Get a link and checksum of the Certificate of Evidence for this Packet
         * @param {string} packetId - The ID that uniquely identifies the Packet.
         */
        retrieveCOE: (packetId) =>
            this.#get(`${this.#packetsPath}/${packetId}/coe/`),
    };

    templates = {
        /**
         * List all Templates. Maximum 50 results per page.
         * @param {object} params
         * @returns All Templates
         */
        list: (params = {}) => this.#get(`${this.#templatesPath}/`, params),

        /**
         * Retrieve a Template.
         * @param {string} templateId - The ID that uniquely identifies the Template.
         * @returns Template Data.
         */
        retrieve: (templateId) =>
            this.#get(`${this.#templatesPath}/${templateId}/`),

        /**
         * Paged list Templates.
         * @param {object} params
         * @param {number} [params.page]
         * @param {number} [params.per_page]
         * @returns {PaginationHelper} List of Templates.
         */
        pagedList: (params = {}) =>
            this.#pagedList(`${this.#bundlesPath}/`, params),
    };
}

export default Client;