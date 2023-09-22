const BUNDLES = {
    CREATE: '/bundles/',
    LIST: '/bundles/',
    RETRIEVE: (bundleId) => `/bundles/${bundleId}/`,
    CANCEL: (bundleId) => `/bundles/${bundleId}/cancel/`,
    LIST_EVENTS: (bundleId) => `/bundles/${bundleId}/events/`,
    LIST_FILES: (bundleId) => `/bundles/${bundleId}/files/`,
    LIST_DATA: (bundleId) => `/bundles/${bundleId}/data/`,
};

const PERSONS = {
    CREATE: '/persons/',
    LIST: '/persons/',
    RETRIEVE: (personId) => `/persons/${personId}/`,
    UPDATE: (personId) => `/persons/${personId}/`,
    DELETE: (personId) => `/persons/${personId}/`,
};

const PACKETS = {
    EMBED_URL: (packetId) => `/packets/${packetId}/embed_url/`,
    UPDATE: (packetId) => `/packets/${packetId}/`,
    REMIND: (packetId) => `/packets/${packetId}/remind/`,
    RETRIEVE_COE: (packetId) => `/packets/${packetId}/coe/`,
};

const TEMPLATES = {
    LIST: '/templates/',
    RETRIEVE: (templateId) => `/templates/${templateId}/`,
};

const WEBHOOKS = {
    CREATE: '/webhooks/',
    LIST: '/webhooks/',
    RETRIEVE: (webhookId) => `/webhooks/${webhookId}/`,
    UPDATE: (webhookId) => `/webhooks/${webhookId}/`,
    DELETE: (webhookId) => `/webhooks/${webhookId}/`,

    CREATE_HEADER: '/webhooks/headers/',
    LIST_HEADERS: '/webhooks/headers/',
    RETRIEVE_HEADER: (webhookHeaderId) => `/webhooks/headers/${webhookHeaderId}/`,
    UPDATE_HEADER: (webhookHeaderId) => `/webhooks/headers/${webhookHeaderId}/`,
    DELETE_HEADER: (webhookHeaderId) => `/webhooks/headers/${webhookHeaderId}/`,

    LIST_EVENTS: '/webhooks/events/',
    RETRIEVE_EVENT: (webhookEventId) => `/webhooks/events/${webhookEventId}/`,

    LIST_DELIVERIES: '/webhooks/deliveries/',
    RETRIEVE_DELIVERY: (webhookDeliveryId) => `/webhooks/deliveries/${webhookDeliveryId}/`,

    RETRIEVE_SECRET: '/webhooks/secret/',
    REGENERATE_SECRET: '/webhooks/secret/regenerate/',
};

module.exports = { BUNDLES, PERSONS, PACKETS, TEMPLATES, WEBHOOKS }
