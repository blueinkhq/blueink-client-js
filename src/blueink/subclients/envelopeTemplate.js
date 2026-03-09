const { ENVELOPE_TEMPLATES } = require('../endpoints')

const EnvelopeTemplateSubClient = (request) => {
    return {
        /**
         * List all Envelope Templates. Maximum 50 results per page.
         * Envelope Templates are reusable document workflows that contain predefined documents,
         * field layouts, signer roles, and configuration settings.
         * @param {object} params
         * @returns All Envelope Templates
         */
        list: (params = {}) => request.get(ENVELOPE_TEMPLATES.LIST, params),

        /**
         * Retrieve an Envelope Template.
         * @param {string} envelopeTemplateId - The ID that uniquely identifies the Envelope Template.
         * @returns Envelope Template Data.
         */
        retrieve: (envelopeTemplateId) =>
            request.get(ENVELOPE_TEMPLATES.RETRIEVE(envelopeTemplateId)),

        /**
         * Paged list Envelope Templates.
         * @param {object} params
         * @param {number} [params.page]
         * @param {number} [params.per_page]
         * @returns {PaginationHelper} List of Envelope Templates.
         */
        pagedList: function (params = {}) {
            return request.pagedList(this.list, params)
        }
    }
}

module.exports = { EnvelopeTemplateSubClient }

