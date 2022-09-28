import crypto from 'crypto';

// Generate key. E.g doc-1, signer-1
export const generateKey = (type) => {
	const randomKey = crypto.randomBytes(2).toString('hex');
	return type.toString().toUpperCase() + '-' + randomKey;
};
