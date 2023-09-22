const BUNDLES = {
    CREATE: '/bundles/',
    LIST: '/bundles/',
    RETRIEVE: (bundle_id) => `/bundles/${bundle_id}/`,
    CANCEL: (bundle_id) => `/bundles/${bundle_id}/cancel/`,
    LIST_EVENTS: (bundle_id) => `/bundles/${bundle_id}/events/`,
    LIST_FILES: (bundle_id) => `/bundles/${bundle_id}/files/`,
    LIST_DATA: (bundle_id) => `/bundles/${bundle_id}/data/`,
};

const PERSONS = {
    CREATE: '/persons/',
    LIST: '/persons/',
    RETRIEVE: (person_id) => `/persons/${person_id}/`,
    UPDATE: (person_id) => `/persons/${person_id}/`,
    DELETE: (person_id) => `/persons/${person_id}/`,
};

const PACKETS = {
    EMBED_URL: (packet_id) => `/packets/${packet_id}/embed_url/`,
    UPDATE: (packet_id) => `/packets/${packet_id}/`,
    REMIND: (packet_id) => `/packets/${packet_id}/remind/`,
    RETRIEVE_COE: (packet_id) => `/packets/${packet_id}/coe/`,
};

const TEMPLATES = {
    LIST: '/templates/',
    RETRIEVE: (template_id) => `/templates/${template_id}/`,
};

const WEBHOOKS = {
    CREATE: '/webhooks/',
    LIST: '/webhooks/',
    RETRIEVE: (webhook_id) => `/webhooks/${webhook_id}/`,
    UPDATE: (webhook_id) => `/webhooks/${webhook_id}/`,
    DELETE: (webhook_id) => `/webhooks/${webhook_id}/`,

    CREATE_HEADER: '/webhooks/headers/',
    LIST_HEADERS: '/webhooks/headers/',
    RETRIEVE_HEADER: (webhook_header_id) => `/webhooks/headers/${webhook_header_id}/`,
    UPDATE_HEADER: (webhook_header_id) => `/webhooks/headers/${webhook_header_id}/`,
    DELETE_HEADER: (webhook_header_id) => `/webhooks/headers/${webhook_header_id}/`,

    LIST_EVENTS: '/webhooks/events/',
    RETRIEVE_EVENT: (webhook_event_id) => `/webhooks/events/${webhook_event_id}/`,

    LIST_DELIVERIES: '/webhooks/deliveries/',
    RETRIEVE_DELIVERY: (webhook_delivery_id) => `/webhooks/deliveries/${webhook_delivery_id}/`,

    RETRIEVE_SECRET: '/webhooks/secret/',
    REGENERATE_SECRET: '/webhooks/secret/regenerate/',
};

module.exports = { BUNDLES, PERSONS, PACKETS, TEMPLATES, WEBHOOKS }