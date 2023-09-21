const WebhookSubClient = ({webhooksPath, webhookHeadersPath, webhookEventsPath, webhookSecretPath}, request) => {
    return {
        // --------------------
        // Webhooks
        // --------------------

        /**
         * List all Webhooks.
         * @param {object} params
         * @returns All Webhooks
         */
        list: (params = {}) => request.get(`${webhooksPath}/`, params),

        /**
         * Create new Webhook Subscription.
         * @param {object} data
         * @param {string} data.url
         * @param {string[]} data.event_types
         * @param {boolean} [data.enabled]
         * @param {boolean} [data.json]
         * @returns New Webhook data
         */
        create: (data) => request.post(`${webhooksPath}/`, data),

        /**
		 * Retrieve a Webhook.
		 * @param {string} webhookId - The ID that uniquely identifies the Webhook.
		 * @returns Webhook Data
		 */
		retrieve: (webhookId) => request.get(`${webhooksPath}/${webhookId}/`),

		/**
		 * Update the Webhook with new data.
		 * NOTE that any subscriptions that are omitted from this request will be DELETED.
		 * If you don't want to replace all data on the Webhook, you probably want to use partialUpdate instead.
		 * @param {string} webhookId - The ID that uniquely identifies the Webhook.
		 * @param {object} data
		 */
		update: (webhookId, data) =>
			request.put(`${webhooksPath}/${webhookId}`, data),

        /**
		 * Partially update the Webhook with new data.
		 * @param {string} webhookId - The ID that uniquely identifies the Webhook.
		 * @param {object} data
		 */
		partialUpdate: (webhookId, data) =>
			request.patch(`${webhooksPath}/${webhookId}`, data),

        /**
		 * Delete a Webhook.
		 * @param {string} webhookId - The ID that uniquely identifies the Webhook.
		 */
		delete: (webhookId) => request.delete(`${webhooksPath}/${webhookId}/`),

        // --------------------
        // Extra Header
        // --------------------

        /**
         * List all Webhook Extra Header.
         * @param {object} params
         * @returns All Webhook Extra Header
         */
        listHeader: (params = {}) => request.get(`${webhookHeadersPath}/`, params),

        /**
         * Create new Webhook Extra Header.
         * @param {object} data
         * @param {string} data.webhook
         * @param {string} data.name
         * @param {string} data.value
         * @param {number} [data.order]
         * @returns New Webhook Extra Header Data
         */
        createHeader: (data) => request.post(`${webhookHeadersPath}/`, data),

        /**
         * Retrieve a Webhook Extra Header.
         * @param {string} webhookExtraHeaderId - The ID that uniquely identifies the Webhook Extra Header.
         * @returns Webhook Extra Header Data
         */
        retrieveHeader: (webhookExtraHeaderId) => request.get(`${webhookHeadersPath}/${webhookExtraHeaderId}/`),

        /**
         * Update the Webhook Extra Header with new data.
         * @param {string} webhookExtraHeaderId - The ID that uniquely identifies the Webhook Extra Header.
         * @param {object} data
         */
        updateHeader: (webhookExtraHeaderId, data) => request.put(`${webhookHeadersPath}/${webhookExtraHeaderId}`, data),

        /**
         * Partially update the Webhook Extra Header with new data.
         * @param {string} webhookExtraHeaderId - The ID that uniquely identifies the Webhook Extra Header.
         * @param {object} data
         */
        partialUpdateHeader: (webhookExtraHeaderId, data) => request.patch(`${webhookHeadersPath}/${webhookExtraHeaderId}`, data),

        /**
         * Delete a Webhook Extra Header.
         * @param {string} webhookExtraHeaderId - The ID that uniquely identifies the Webhook Extra Header.
         */
        deleteHeader: (webhookExtraHeaderId) => request.delete(`${webhookHeadersPath}/${webhookExtraHeaderId}/`),
        
        // --------------------
        // Events
        // --------------------

        /**
         * List all Webhook Events.
         * @param {object} params
         * @param {string} [params.webhook] - A query for deliveries with events belonging to a specific webhook.
         * @param {string} [params.event_type] - A query for events of a specific type.
         * @returns All Webhooks Events
         */
        listEvents: (params = {}) => request.get(`${webhookEventsPath}/`, params),

        //TODO: retrieve_event

        // --------------------
        // TOD: Deliveries
        // --------------------


        // --------------------
        // Secret
        // --------------------

        /**
		 * Retrieve Webhook Shared Secret.
		 * @returns Webhook Shared Secret Data
		 */
		retrieveSecret: () => request.get(`${webhookSecretPath}/`),

        /**
		 * Regenerate Webhook Shared Secret.
		 * @returns New Webhook Shared Secret Data
		 */
        regenerateSecret: () => request.post(`${webhookSecretPath}/regenerate/`),
    }
}


module.exports = { WebhookSubClient }