const { PACKETS } = require('../endpoints')

const PacketSubClient = (request) => {
  return {
    /**
         * Update a Packet
         * @param {string} packetId - The ID that uniquely identifies the Packet.
         * @param {object} data
         */
    update: (packetId, data) =>
      request.patch(PACKETS.UPDATE(packetId), data),

    /**
         * Send a Reminder email or SMS to a Signer.
         * @param {string} packetId - The ID that uniquely identifies the Packet.
         */
    remind: (packetId) => request.put(PACKETS.REMIND(packetId)),

    /**
         * Get a link and checksum of the Certificate of Evidence for this Packet
         * @param {string} packetId - The ID that uniquely identifies the Packet.
         */
    retrieveCOE: (packetId) =>
      request.get(PACKETS.RETRIEVE_COE(packetId)),

    /**
         * Create a URL which can be used for embedded signing.
         * @param {string} packetId - The ID that uniquely identifies the Packet.
         */
    embedUrl: (packetId) => request.post(PACKETS.EMBED_URL(packetId))
  }
}

module.exports = { PacketSubClient }
