const crypto = require('crypto');

// Generate key. E.g doc-1, signer-1
const generateKey = (type) => {
	const randomKey = crypto.randomBytes(2).toString('hex');
	return type.toString().toUpperCase() + '-' + randomKey;
};

module.exports = { generateKey };
