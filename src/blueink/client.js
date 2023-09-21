require('dotenv').config()
const axios = require("axios");
const has = require("lodash.has");

const PaginationHelper = require("./helper/pagination.js");
const { BLUEINK_PAGINATION_HEADER, DEFAULT_BASE_URL } = require("./constants.js");

const RequestHelper = require('./helper/RequestHelper.js');
const { BundleSubClient } = require('./subclients/bundle.js');
const { PersonSubClient } = require('./subclients/person.js');
const { PacketSubClient } = require('./subclients/packet.js');
const { WebhookSubClient } = require('./subclients/webhook.js');
const { TemplateSubClient } = require('./subclients/template.js');
class Client {
    #privateApiKey;
    #defaultBaseUrl = DEFAULT_BASE_URL;
    #baseApiUrl;
    #bundlesPath = "/bundles";
    #personsPath = "/persons";
    #packetsPath = "/packets";
    #templatesPath = "/templates";
    #webhooksPath = "/webhooks";
    #webhookEventsPath = "/webhooks/events/";
    #webhookDeliveriesPath = "/webhooks/deliveries/";
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

        const request = new RequestHelper(this.#privateApiKey, this.#baseApiUrl)

        this.bundles = BundleSubClient(this.#bundlesPath, request)
        this.persons = PersonSubClient(this.#personsPath, request)
        this.packets = PacketSubClient(this.#packetsPath, request)
        this.templates = TemplateSubClient(this.#templatesPath, request)
        this.webhooks = WebhookSubClient({
            webhooksPath: this.#webhooksPath,
            webhookHeadersPath: this.#webhookHeadersPath,
            webhookEventsPath: this.#webhookEventsPath,
            webhookDeliveriesPath: this.#webhookDeliveriesPath,
            webhookSecretPath: this.#webhookSecretPath,
        }, request)
    }
}

module.exports = Client;