const { VERIFY } = require('../endpoints')

const VerifySubClient = (request) => {
  return {
    /**
     * Verify a signed PDF against the Blueink application (POST /verify/).
     * @param {object} data - Payload containing the hash (sha256) of the document to verify.
     * @returns Verification details
     */
    create: (data) => request.post(VERIFY.CREATE, data)
  }
}

module.exports = { VerifySubClient }
