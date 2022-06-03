import crypto from 'crypto';

// Just generate some random number for now
export const generateKey = (type) => {
	const randomKey = crypto.randomBytes(2).toString('hex');
	return type.toString().toUpperCase() + '-' + randomKey;
};
