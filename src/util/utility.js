const utilities = {}

utilities.handleError = (err) => {
    if (err.response.data.detail) {
        const error = new Error(err.response.data.detail);
        error.code = err.response.data.code;
        throw error;
    } else if (err.response) {
        const error = new Error(JSON.stringify(err.response.data));
        error.code = err.response.status;
        throw error;
    } else {
        throw new Error(JSON.stringify(err));
    }
}

module.exports = utilities

