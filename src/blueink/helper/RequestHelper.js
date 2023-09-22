const axios = require('axios')
const has = require("lodash.has");
const PaginationHelper = require("./pagination.js");
const { BLUEINK_PAGINATION_HEADER } = require("../constants.js");

class RequestHelper {
    constructor(privateApiKey, baseApiUrl) {
        this._axios = axios.create({
            baseURL: baseApiUrl,
            headers: {
                common: {
                    Authorization: `Token ${privateApiKey}`,
                },
            },
        })

        this._axios.interceptors.response.use(response => {
            response.pagination = this.getPagination(response);
            return response;
        }, error => {
            return Promise.reject(error);
        });
    }

    getPagination = (response) => {
        if (has(response.headers, BLUEINK_PAGINATION_HEADER)) {
            const paginationBits = response.headers[BLUEINK_PAGINATION_HEADER].split(',');

            return {
                pageNumber: parseInt(paginationBits[0]),
                totalPages: parseInt(paginationBits[1]),
                perPage: parseInt(paginationBits[2]),
                totalResults: parseInt(paginationBits[3]),
            };
        }

        return null;
    };

    post = (path, data) => {
        if (has(data, "headers")) {
            return this._axios.post(path, data.data, {
                headers: {
                    ...data.headers,
                },
            });
        }
        return this._axios.post(path, data);
    };

    get = (path, params = {}) => {
        return this._axios.get(`${path}`, {
            params: params,
        });
    };

    pagedList = (request, params = {}) => {
        return new PaginationHelper(request, params)
    };

    put = (path, data = {}) => {
        return this._axios.put(path, data);
    };

    delete = (path, data) => {
        return axios({
            url: path,
            method: "DELETE",
            data: data,
        });
    };

    patch = (path, data) => {
        return this._axios.patch(path, data);
    };
}

module.exports = RequestHelper;
