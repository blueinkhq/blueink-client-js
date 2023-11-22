const { PERSON_CHANNEL_KIND } = require('../constants')
/**
 * Helper class to aid building a Person
 */
class PersonHelper {
  /**
   * Creates a new PersonHelper instance.
   * @param {string|null} name - The name of the person.
   * @param {Object} metadata - Additional metadata for the person.
   * @param {string[]} phones - An array of phone numbers for the person.
   * @param {string[]} emails - An array of email addresses for the person.
   */
  constructor (name = null, metadata = {}, phones = [], emails = []) {
    this._name = name
    this._metadata = metadata
    this._phones = phones
    this._emails = emails
  }

  /**
   * Adds a phone number to the person's list of phone numbers.
   * @param {string} phone - The phone number to add.
   * @returns {string[]} - The updated list of phone numbers.
   */
  addPhone (phone) {
    this._phones.push(phone)
    return [...this._phones]
  }

  /**
   * Sets the person's list of phone numbers.
   * @param {string[]} phones - The new list of phone numbers.
   * @returns {string[]} - The updated list of phone numbers.
   */
  setPhones (phones) {
    this._phones = phones
    return [...this._phones]
  }

  /**
   * Gets the person's list of phone numbers.
   * @returns {string[]} - The list of phone numbers.
   */
  getPhones () {
    return [...this._phones]
  }

  /**
   * Adds an email address to the person's list of email addresses.
   * @param {string} email - The email address to add.
   * @returns {string[]} - The updated list of email addresses.
   */
  addEmail (email) {
    this._emails.push(email)
    return [...this._emails]
  }

  /**
   * Sets the person's list of email addresses.
   * @param {string[]} emails - The new list of email addresses.
   * @returns {string[]} - The updated list of email addresses.
   */
  setEmails (emails) {
    this._emails = emails
    return [...this._emails]
  }

  /**
   * Gets the person's list of email addresses.
   * @returns {string[]} - The list of email addresses.
   */
  getEmails () {
    return [...this._emails]
  }

  /**
   * Sets the person's metadata.
   * @param {Object} metadata - The new metadata.
   * @returns {Object} - The updated metadata.
   */
  setMetadata (metadata) {
    this._metadata = metadata
    return { ...this._metadata }
  }

  /**
   * Sets the person's name.
   * @param {string} name - The new name.
   * @returns {string} - The updated name.
   */
  setName (name) {
    this._name = name
    return this._name
  }

  /**
   * Returns the person's data as a dictionary.
   * @param {Object} additionalData - Additional data to include in the dictionary.
   * @returns {Object} - The person's data as a dictionary.
   */
  asDict (additionalData = {}) {
    const channels = []

    for (const email of this._emails) {
      channels.push({ email, kind: PERSON_CHANNEL_KIND.EMAIL })
    }
    for (const phone of this._phones) {
      channels.push({ phone, kind: PERSON_CHANNEL_KIND.PHONE })
    }

    const personOut = {
      name: this._name,
      metadata: this._metadata,
      channels
    }
    let outDict = { ...personOut }

    // Merge in the additional data
    outDict = { ...outDict, ...additionalData }

    return outDict
  }
}

module.exports = PersonHelper
