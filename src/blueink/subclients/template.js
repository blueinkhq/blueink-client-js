const { TEMPLATES } = require('../endpoints')

const TemplateSubClient = (request) => {
  return {
    /**
         * List all Templates. Maximum 50 results per page.
         * @param {object} params
         * @returns All Templates
         */
    list: (params = {}) => request.get(TEMPLATES.LIST, params),

    /**
         * Retrieve a Template.
         * @param {string} templateId - The ID that uniquely identifies the Template.
         * @returns Template Data.
         */
    retrieve: (templateId) =>
      request.get(TEMPLATES.RETRIEVE(templateId)),

    /**
         * Partially update a Template (PATCH). Typically used to update
         * metadata on an existing Template.
         * @param {string} templateId - The ID that uniquely identifies the Template.
         * @param {object} data - Fields to update on the Template.
         * @returns Updated Template Data.
         */
    update: (templateId, data) =>
      request.patch(TEMPLATES.UPDATE(templateId), data),

    /**
         * Soft-delete a Document Template (DELETE). The API disables the
         * template and removes it from account libraries (HTTP 204).
         * Globally shared templates cannot be deleted (HTTP 403).
         * @param {string} templateId - The ID that uniquely identifies the Template.
         * @returns Empty response on success.
         */
    delete: (templateId) =>
      request.delete(TEMPLATES.DELETE(templateId)),

    /**
         * Create an embedded Document Template preparation session.
         * Pass `allowed_data_flow_tags` as exact tag names or namespace-prefix
         * patterns such as `acme:*`. An empty list allows no tags.
         * @param {object} data - Session configuration.
         * @returns Preparation session URL and expiry.
         */
    createPreparationSession: (data) =>
      request.post(TEMPLATES.CREATE_PREPARATION_SESSION, data),

    /**
         * Paged list Templates.
         * @param {object} params
         * @param {number} [params.page]
         * @param {number} [params.per_page]
         * @returns {PaginationHelper} List of Templates.
         */
    pagedList: function (params = {}) {
      return request.pagedList(this.list, params)
    }
  }
}

module.exports = { TemplateSubClient }
