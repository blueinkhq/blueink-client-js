const { BUNDLES } = require('../endpoints')
const { BUNDLE_STATUS } = require('../constants')

const BundleSubClient = (request) => {
    return {
        /**
         * Create new Bundle.
         * @param {object} data
         * @returns New Bundle data
         */
        create: (data) => request.post(BUNDLES.CREATE, data),
        
        /**
         * Create new Bundle using BundleHelper convenience object.
         * @param {object} bundleHelper BundleHelper setup of a person
         * @returns New Bundle data
         */
        createFromBundleHelper: function (bundleHelper) {
            const data = bundleHelper.asData();
            // If envelope_template is present, use the special endpoint
            if (data.envelope_template) {
                return this.createFromEnvelopeTemplate(data);
            }
            return this.create(data);
        },

        /**
         * Create new Bundle from an Envelope Template.
         * Envelope Templates are reusable document workflows with predefined documents,
         * field layouts, signer roles, and configuration settings.
         * Uses the /bundles/create_from_envelope_template/ endpoint.
         * @param {object} data - Bundle data with envelope_template
         * @param {object} data.envelope_template - Envelope template configuration
         * @param {string} data.envelope_template.template_id - The ID of the Envelope Template to use (format: T-xxx)
         * @param {object} [data.envelope_template.field_values] - Field values to populate in the template
         * @param {array} [data.packets] - Signer information (packets)
         * @returns New Bundle data
         */
        createFromEnvelopeTemplate: function (data) {
            return request.post(BUNDLES.CREATE_FROM_ENVELOPE_TEMPLATE, data)
        },

        /**
         * List all Bundles. Maximum 50 results per page.
         * @param {object} params
         * @returns All Bundles.
         */
        list: async (params = {}) => {
            if (params.related_data === true) {
                const response = await request.get(BUNDLES.LIST, params);
                response.data = await Promise.all(
                    response.data.map(async (bundle) => {
                        const related_data = await getRelatedData(request, path, bundle);
                        return { ...bundle, related_data };
                    })
                );
                return response;
            } else {
                return request.get(BUNDLES.LIST, params);
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
                const response = await request.get(BUNDLES.RETRIEVE(bundleId));
                const related_data = await getRelatedData(request, path, response.data);
                response.data = { ...response.data, related_data };
                return response;
            } else {
                return request.get(BUNDLES.RETRIEVE(bundleId));
            }
        },

        /**
         * Cancel a Bundle.
         * @param {string} bundleId - The ID that uniquely identifies the Bundle.
         */
        cancel: (bundleId) => request.put(BUNDLES.CANCEL(bundleId)),

        /**
         * Get a list of Events that are associated with the Bundle.
         * @param {string} bundleId - The ID that uniquely identifies the Bundle.
         */
        listEvents: (bundleId) =>
            request.get(BUNDLES.LIST_EVENTS(bundleId)),

        /**
         * Get downloadable files for a completed Bundle.
         * @param {string} bundleId - The ID that uniquely identifies the Bundle.
         */
        listFiles: (bundleId) =>
            request.get(BUNDLES.LIST_FILES(bundleId)),

        /**
         * Get data entered into fields for a completed Bundle.
         * @param {string} bundleId - The ID that uniquely identifies the Bundle.
         */
        listData: (bundleId) => request.get(BUNDLES.LIST_DATA(bundleId)),

        /**
         * Paged list Bundles.
         * @param {object} params
         * @param {number} [params.page]
         * @param {number} [params.per_page]
         * @returns {PaginationHelper} List of Bundles.
         */
        pagedList: function(params) {
            return request.pagedList(this.list, params)
        }
    };
}

const getRelatedData = async (request, path, bundle) => {
    try {
        const related_data = {};
        related_data.events = await request.get(BUNDLES.LIST_EVENTS(bundle.id));
        if (bundle.status === BUNDLE_STATUS.COMPLETE) {
            related_data.files = await request.get(BUNDLES.LIST_FILES(bundle.id));
            related_data.data = await request.get(BUNDLES.LIST_DATA(bundle.id));
        }
        return related_data;
    } catch (error) {
        throw error;
    }
};


module.exports = { BundleSubClient }
