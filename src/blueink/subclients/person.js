const { PERSONS } = require('../endpoints')

const PersonSubClient = (request) => {
    return {
        /**
         * Create new Person.
         * @param {object} data
         * @returns New Person data
         */
        create: function (data) {
            return request.post(PERSONS.CREATE, data)
        },

        /**
         * Create a person using PersonHelper convenience object.
         * @param {object} personHelper PersonHelper setup of a person
         * @returns New Person data
         */
        createFromPersonHelper: function (personHelper) {
            return this.create(personHelper.asDict())
        }, 

        /**
         * List all Persons. Maximum 50 results per page.
         * @param {object} params
         * @returns All Persons.
         */
        list: (params = {}) => request.get(PERSONS.LIST, params),

        /**
         * Retrieve a Person.
         * @param {string} personId - The ID that uniquely identifies the Person.
         * @returns Person Data
         */
        retrieve: (personId) => request.get(PERSONS.RETRIEVE(personId)),

        /**
         * Update a Person.
         * @param {string} personId - The ID that uniquely identifies the Person.
         * @param {object} data
         */
        update: (personId, data) =>
            request.put(PERSONS.UPDATE(personId), data),

        /**
         * Partial update a Person.
         * @param {string} personId - The ID that uniquely identifies the Person.
         * @param {object} data
         */
        partialUpdate: (personId, data) =>
            request.patch(PERSONS.UPDATE(personId), data),

        /**
         * Delete a Person.
         * @param {string} personId
         */
        delete: (personId) => request.delete(PERSONS.DELETE(personId)),

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
