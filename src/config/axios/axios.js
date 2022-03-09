const base_api_url = "https://api.blueink.com/api/v2";
const axios = require('axios').default;

const instance = axios.create({
	baseURL: base_api_url,
});


module.exports = instance;
