const { WEBHOOKS } = require('../endpoints')

const WebhookSubClient = (request) => {
    return {
        // --------------------
        // Webhooks
        // --------------------

        /**
         * List all Webhooks.
         * @param {object} params
         * @returns All Webhooks
         */
        list: (params = {}) => request.get(WEBHOOKS.LIST, params),

        /**
         * Create new Webhook Subscription.
         * @param {object} data
         * @param {string} data.url
         * @param {string[]} data.event_types
         * @param {boolean} [data.enabled]
         * @param {boolean} [data.json]
         * @returns New Webhook data
         */
        create: (data) => request.post(WEBHOOKS.CREATE, data),

        /**
		 * Retrieve a Webhook.
		 * @param {string} webhookId - The ID that uniquely identifies the Webhook.
		 * @returns Webhook Data
		 */
		retrieve: (webhookId) => request.get(WEBHOOKS.RETRIEVE(webhookId)),

		/**
		 * Update the Webhook with new data.
		 * NOTE that any subscriptions that are omitted from this request will be DELETED.
		 * If you don't want to replace all data on the Webhook, you probably want to use partialUpdate instead.
		 * @param {string} webhookId - The ID that uniquely identifies the Webhook.
		 * @param {object} data
		 */
		update: (webhookId, data) =>
            request.put(WEBHOOKS.UPDATE(webhookId), data),

        /**
		 * Partially update the Webhook with new data.
		 * @param {string} webhookId - The ID that uniquely identifies the Webhook.
		 * @param {object} data
		 */
		partialUpdate: (webhookId, data) =>
            request.patch(WEBHOOKS.UPDATE(webhookId), data),

        /**
		 * Delete a Webhook.
		 * @param {string} webhookId - The ID that uniquely identifies the Webhook.
		 */
		delete: (webhookId) => request.delete(WEBHOOKS.DELETE(webhookId)),

        // --------------------
        // Extra Header
        // --------------------

        /**
         * List all Webhook Extra Header.
         * @param {object} params
         * @returns All Webhook Extra Header
         */
        listHeader: (params = {}) => request.get(WEBHOOKS.LIST_HEADERS, params),

        /**
         * Create new Webhook Extra Header.
         * @param {object} data
         * @param {string} data.webhook
         * @param {string} data.name
         * @param {string} data.value
         * @param {number} [data.order]
         * @returns New Webhook Extra Header Data
         */
        createHeader: (data) => request.post(WEBHOOKS.CREATE_HEADER, data),

        /**
         * Retrieve a Webhook Extra Header.
         * @param {string} webhookExtraHeaderId - The ID that uniquely identifies the Webhook Extra Header.
         * @returns Webhook Extra Header Data
         */
        retrieveHeader: (webhookExtraHeaderId) => request.get(WEBHOOKS.RETRIEVE_HEADER(webhookExtraHeaderId)),

        /**
         * Update the Webhook Extra Header with new data.
         * @param {string} webhookExtraHeaderId - The ID that uniquely identifies the Webhook Extra Header.
         * @param {object} data
         */
        updateHeader: (webhookExtraHeaderId, data) => request.put(WEBHOOKS.UPDATE_HEADER(webhookExtraHeaderId), data),

        /**
         * Partially update the Webhook Extra Header with new data.
         * @param {string} webhookExtraHeaderId - The ID that uniquely identifies the Webhook Extra Header.
         * @param {object} data
         */
        partialUpdateHeader: (webhookExtraHeaderId, data) => request.patch(WEBHOOKS.UPDATE_HEADER(webhookExtraHeaderId), data),

        /**
         * Delete a Webhook Extra Header.
         * @param {string} webhookExtraHeaderId - The ID that uniquely identifies the Webhook Extra Header.
         */
        deleteHeader: (webhookExtraHeaderId) => request.delete(WEBHOOKS.DELETE_HEADER(webhookExtraHeaderId)),
        
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
        listEvents: (params = {}) => request.get(WEBHOOKS.LIST_EVENTS, params),

        /**
         * Retrieve a Webhook Events.
         * @param {string} webhookEventId - The ID that uniquely identifies the Webhook Events.
         * @returns Webhook Events Data
         */
        retrieveEvent: (webhookEventId) => request.get(WEBHOOKS.RETRIEVE_EVENT(webhookEventId)),

        // --------------------
        // Deliveries
        // --------------------

        /**
         * List all Webhook Deliveries.
         * @param {object} params
         * @param {string} [params.webhook] - A query for deliveries with events belonging to a specific webhook.
         * @param {string} [params.event_type] - A query for events of a specific type.
         * @returns All Webhooks Events
         */
        listDeliveries: (params = {}) => request.get(WEBHOOKS.LIST_DELIVERIES, params),

        /**
         * Retrieve a Webhook Deliveries.
         * @param {string} webhookDeliveryId - The ID that uniquely identifies the Webhook Deliveries.
         * @returns Webhook Deliveries Data
         */
        retrieveDelivery: (webhookDeliveryId) => request.get(WEBHOOKS.RETRIEVE_DELIVERY(webhookDeliveryId)),

        // --------------------
        // Secret
        // --------------------

        /**
		 * Retrieve Webhook Shared Secret.
		 * @returns Webhook Shared Secret Data
		 */
		retrieveSecret: () => request.get(WEBHOOKS.RETRIEVE_SECRET),

        /**
		 * Regenerate Webhook Shared Secret.
		 * @returns New Webhook Shared Secret Data
		 */
        regenerateSecret: () => request.post(WEBHOOKS.REGENERATE_SECRET),
    }
}


module.exports = { WebhookSubClient }
