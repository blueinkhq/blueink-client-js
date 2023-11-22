require('dotenv').config()

const { DEFAULT_BASE_URL } = require('./constants.js')
const RequestHelper = require('./helper/requestHelper.js')
const { BundleSubClient } = require('./subclients/bundle.js')
const { PacketSubClient } = require('./subclients/packet.js')
const { PersonSubClient } = require('./subclients/person.js')
const { TemplateSubClient } = require('./subclients/template.js')
const { WebhookSubClient } = require('./subclients/webhook.js')

class Client {
  #privateApiKey
  #defaultBaseUrl = DEFAULT_BASE_URL
  #baseApiUrl

  /**
     * @param {string} privateApiKey
     * @param {string} [baseApiUrl]
     */
  constructor (privateApiKey, baseApiUrl) {
    // Define Private Key
    this.#privateApiKey = privateApiKey || process.env.BLUEINK_PRIVATE_API_KEY

    if (!this.#privateApiKey) {
      throw Error(
        'Blueink Private API Key must be passed to the Client on initialization, ' +
                'or provided in the environment variable BLUEINK_PRIVATE_API_KEY.'
      )
    }
    // Define Base URL
    this.#baseApiUrl =
            baseApiUrl || process.env.BLUEINK_API_URL || this.#defaultBaseUrl

    const request = new RequestHelper(this.#privateApiKey, this.#baseApiUrl)

    this.bundles = BundleSubClient(request)
    this.persons = PersonSubClient(request)
    this.packets = PacketSubClient(request)
    this.templates = TemplateSubClient(request)
    this.webhooks = WebhookSubClient(request)
  }
}

module.exports = Client
