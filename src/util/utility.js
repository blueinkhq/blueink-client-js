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

// Just generate some random number for now
utilities.generateKey = (type) => {
    return type.toString().toUpperCase() + '-' + Math.floor(Math.random() * 1000).toString();
}

utilities.isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
}

export {utilities}

