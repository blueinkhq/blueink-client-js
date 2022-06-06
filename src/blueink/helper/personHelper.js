import { CONTACT_CHANNEL } from '../constants.js';
import { generateUUID } from '../../util/utility.js';

class PersonHelper {
	CONTACT_CHANNEL = CONTACT_CHANNEL;

	/**
	 * Define Person Helper
	 * @param {Object} newPersonData
	 * @param {string} newPersonData.name
	 * @param {Object} newPersonData.metadata
	 * @param {Array} newPersonData.phones
	 * @param {Array} newPersonData.emails
	 */
	constructor(newPersonData) {
		this.name = newPersonData.name || '';
		this.metadata = newPersonData.metadata || {};
		this.phones = newPersonData.phones || [];
		this.emails = newPersonData.emails || [];
	}

	/**
	 * Add a new phone number to the current list of phone numbers
	 * @param {string} phone
	 * @returns New list of the phone numbers
	 */
	addPhone = (phone) => {
		this.phones.push(phone);
		return this.phones;
	};

	/**
	 * Replace the current list of phone numbers with new list
	 * @param {Array} newPhoneList
	 * @returns New list of the phone numbers
	 */
	setPhones = (newPhoneList) => {
		this.phones = [...newPhoneList];
		return this.phones;
	};

	/**
	 * Get all of the phone numbers in the list
	 * @returns Current list of the phone numbers
	 */
	getPhones = () => {
		return this.phones;
	};

	/**
	 * Add an email to the current email list
	 * @param {string} email
	 * @returns New list of the emails
	 */
	addEmail = (email) => {
		this.emails.push(email);
		return this.emails;
	};

	/**
	 * Replace the current list of emails with new list
	 * @param {Array} newEmailList
	 * @returns New list of the emails
	 */
	setEmails = (newEmailList) => {
		this.emails = newEmailList;
		return this.emails;
	};

	/**
	 * Get all of the emails in the list
	 * @returns Current list of emails
	 */
	getEmails = () => {
		return this.emails;
	};

	/**
	 * Get the person object data
	 * @returns Peron Data
	 */
	asData = () => {
		const channels = [];
		for (let email of this.emails) {
            channels.push({
                id: generateUUID(),
                email,
                kind: CONTACT_CHANNEL.EMAIL,
            })
		}

        for (let phone of this.phones) {
            channels.push({
                id: generateUUID(),
                phone,
                kind: CONTACT_CHANNEL.PHONE,
            })
		}

        const person = {
            name: this.name,
            metadata: this.metadata,
            channels,
        }
        
        return person;
	};
}

export default PersonHelper;
