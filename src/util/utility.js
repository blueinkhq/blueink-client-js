import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// Generate random chars for key
export const generateKey = (type) => {
	const randomKey = crypto.randomBytes(2).toString('hex');
	return type.toString().toUpperCase() + '-' + randomKey;
};

// Generate UUID for channels
export const generateUUID = () => {
	return uuidv4();
};
