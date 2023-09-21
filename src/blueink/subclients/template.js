const TemplateSubClient = (path, request) => {
    return {
        /**
         * List all Templates. Maximum 50 results per page.
         * @param {object} params
         * @returns All Templates
         */
        list: (params = {}) => request.get(`${path}/`, params),

        /**
         * Retrieve a Template.
         * @param {string} templateId - The ID that uniquely identifies the Template.
         * @returns Template Data.
         */
        retrieve: (templateId) =>
            request.get(`${path}/${templateId}/`),

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