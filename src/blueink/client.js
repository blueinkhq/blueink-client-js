import "dotenv/config";
import axios from "axios";
import has from "lodash.has";

import { PaginationHelper } from "./helper/pagination.js";
import { DEFAULT_BASE_URL } from "./constants.js";


class Client {
    #privateApiKey;
    #defaultBaseUrl = DEFAULT_BASE_URL;
    #baseApiUrl;
    #bundlesPath = "/bundles";
    #personsPath = "/persons";
    #packetsPath = "/packets";
    #templatesPath = "/templates";
    #webhooksPath = "/webhooks";
    #webhookEventsPath = "/webhooks/deliveries/";
    #webhookHeadersPath = "/webhooks/headers/";
    #webhookSecretPath = "/webhooks/secret/";

    /**
     * @param {string} privateApiKey
     * @param {string} [baseApiUrl]
     */
    constructor(privateApiKey, baseApiUrl) {
        // Define Private Key
        this.#privateApiKey = privateApiKey || process.env.BLUEINK_PRIVATE_API_KEY;

        if (!this.#privateApiKey) {
            throw Error(
                'Blueink Private API Key must be passed to the Client on initialization, '
                + 'or provided in the environment variable BLUEINK_PRIVATE_API_KEY.'
            )
        }
        // Define Base URL
        this.#baseApiUrl =
            baseApiUrl || process.env.BLUEINK_API_URL || this.#defaultBaseUrl;

        this._axios = axios.create({
            baseURL: this.#baseApiUrl,
            headers: {
                common: {
                    Authorization: `Token ${this.#privateApiKey}`,
                },
            },
        })

        this._axios.interceptors.response.use(response => {
            response.pagination = this.getPagination(response);
            return response;
        }, error => {
            return Promise.reject(error);
        });
    }

    getPagination = (response) => {
        if (has(response.headers, 'x-blueink-pagination')) {
            const paginationBits = response.headers['x-blueink-pagination'].split(',');

            return {
                pageNumber: parseInt(paginationBits[0]),
                totalPages: parseInt(paginationBits[1]),
                perPage: parseInt(paginationBits[2]),
                totalResults: parseInt(paginationBits[3]),
            };
        }

        return null;
    };

    #post = (path, data) => {
        if (has(data, "headers")) {
            return this._axios.post(path, data.data, {
                headers: {
                    ...data.headers,
                },
            });
        }
        return this._axios.post(path, data);
    };

    #get = (path, params = {}) => {
        return this._axios.get(`${path}`, {
            params: params,
        });
    };

    #pagedList = async (request, params = {}) => {
        return new PaginationHelper(request, params)
    };

    #put = (path, data = {}) => {
        return this._axios.put(path, data);
    };

    #delete = (path, data) => {
        return axios({
            url: path,
            method: "DELETE",
            data: data,
        });
    };

    #patch = (path, data) => {
        return this._axios.patch(path, data);
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
        pagedList: (params) => this.#pagedList(this.bundles.list, params),
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
            this.#pagedList(this.persons.list, params),
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
            this.#pagedList(this.templates.list, params),
    };

    webhooks = {
        /**
         * List all Webhooks.
         * @param {object} params
         * @returns All Webhooks
         */
        list: (params = {}) => this.#get(`${this.#webhooksPath}/`, params),

        /**
         * Create new Webhook Subscription.
         * @param {object} data
         * @param {string} data.url
         * @param {string[]} data.event_types
         * @param {boolean} [data.enabled]
         * @param {boolean} [data.json]
         * @returns New Webhook data
         */
        create: (data) => this.#post(`${this.#webhooksPath}/`, data),

        /**
		 * Retrieve a Webhook.
		 * @param {string} webhookId - The ID that uniquely identifies the Webhook.
		 * @returns Webhook Data
		 */
		retrieve: (webhookId) => this.#get(`${this.#webhooksPath}/${webhookId}/`),

		/**
		 * Update the Webhook with new data.
		 * NOTE that any subscriptions that are omitted from this request will be DELETED.
		 * If you don't want to replace all data on the Webhook, you probably want to use partialUpdate instead.
		 * @param {string} webhookId - The ID that uniquely identifies the Webhook.
		 * @param {object} data
		 */
		update: (webhookId, data) =>
			this.#put(`${this.#webhooksPath}/${webhookId}`, data),

        /**
		 * Partially update the Webhook with new data.
		 * @param {string} webhookId - The ID that uniquely identifies the Webhook.
		 * @param {object} data
		 */
		partialUpdate: (webhookId, data) =>
			this.#patch(`${this.#webhooksPath}/${webhookId}`, data),

        /**
		 * Delete a Webhook.
		 * @param {string} webhookId - The ID that uniquely identifies the Webhook.
		 */
		delete: (webhookId) => this.#delete(`${this.#webhooksPath}/${webhookId}/`),
    }

    webhookEvents = {
        /**
         * List all Webhook Events.
         * @param {object} params
         * @param {string} [params.webhook] - A query for deliveries with events belonging to a specific webhook.
         * @param {string} [params.event_type] - A query for events of a specific type.
         * @returns All Webhooks Events
         */
        list: (params = {}) => this.#get(`${this.#webhookEventsPath}/`, params),
    }

    webhookHeaders = {
        /**
         * List all Webhook Extra Header.
         * @param {object} params
         * @returns All Webhook Extra Header
         */
        list: (params = {}) => this.#get(`${this.#webhookHeadersPath}/`, params),

        /**
         * Create new Webhook Extra Header.
         * @param {object} data
         * @param {string} data.webhook
         * @param {string} data.name
         * @param {string} data.value
         * @param {number} [data.order]
         * @returns New Webhook Extra Header Data
         */
        create: (data) => this.#post(`${this.#webhookHeadersPath}/`, data),

        /**
		 * Retrieve a Webhook Extra Header.
		 * @param {string} webhookExtraHeaderId - The ID that uniquely identifies the Webhook Extra Header.
		 * @returns Webhook Extra Header Data
		 */
		retrieve: (webhookExtraHeaderId) => this.#get(`${this.#webhookHeadersPath}/${webhookExtraHeaderId}/`),

        /**
		 * Update the Webhook Extra Header with new data.
		 * @param {string} webhookExtraHeaderId - The ID that uniquely identifies the Webhook Extra Header.
		 * @param {object} data
		 */
		update: (webhookExtraHeaderId, data) => this.#put(`${this.#webhookHeadersPath}/${webhookExtraHeaderId}`, data),

        /**
		 * Partially update the Webhook Extra Header with new data.
		 * @param {string} webhookExtraHeaderId - The ID that uniquely identifies the Webhook Extra Header.
		 * @param {object} data
		 */
		partialUpdate: (webhookExtraHeaderId, data) => this.#patch(`${this.#webhookHeadersPath}/${webhookExtraHeaderId}`, data),

        /**
		 * Delete a Webhook Extra Header.
		 * @param {string} webhookExtraHeaderId - The ID that uniquely identifies the Webhook Extra Header.
		 */
		delete: (webhookExtraHeaderId) => this.#delete(`${this.#webhookHeadersPath}/${webhookExtraHeaderId}/`),
    }

    webhookSecret = {
        /**
		 * Retrieve Webhook Shared Secret.
		 * @returns Webhook Shared Secret Data
		 */
		retrieve: () => this.#get(`${this.#webhookSecretPath}/`),

        /**
		 * Regenerate Webhook Shared Secret.
		 * @returns New Webhook Shared Secret Data
		 */
        regenerate: () => this.#post(`${this.#webhookSecretPath}/regenerate/`),
    }
}

export default Client;