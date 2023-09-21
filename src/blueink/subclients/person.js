const PersonSubClient = (path, request) => {
    return {
        /**
         * Create new Person.
         * @param {object} data
         * @returns New Person data
         */
        create: (data) => request.post(`${path}/`, data),

        /**
         * List all Persons. Maximum 50 results per page.
         * @param {object} params
         * @returns All Persons.
         */
        list: (params = {}) => request.get(`${path}/`, params),

        /**
         * Retrieve a Person.
         * @param {string} personId - The ID that uniquely identifies the Person.
         * @returns Person Data
         */
        retrieve: (personId) => request.get(`${path}/${personId}/`),

        /**
         * Update a Person.
         * @param {string} personId - The ID that uniquely identifies the Person.
         * @param {object} data
         */
        update: (personId, data) =>
            request.put(`${path}/${personId}/`, data),

        /**
         * Partial update a Person.
         * @param {string} personId - The ID that uniquely identifies the Person.
         * @param {object} data
         */
        partialUpdate: (personId, data) =>
            request.patch(`${path}/${personId}/`, data),

        /**
         * Delete a Person.
         * @param {string} personId
         */
        delete: (personId) => request.delete(`${path}/${personId}/`),

        /**
         * Paged list Persons.
         * @param {object} params
         * @param {number} [params.page]
         * @param {number} [params.per_page]
         * @returns {PaginationHelper} List of Persons.
         */
        pagedList: function (params = {}) {
            return request.pagedList(this.list, params)
        }
    };
}

module.exports = { PersonSubClient }


// const PersonSubClient = (path, request) => {
//     return {

//     };
// }


// module.exports = { PersonSubClient }