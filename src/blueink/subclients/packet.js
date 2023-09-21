const PacketSubClient = (path, request) => {
    return {
        /**
         * Update a Packet
         * @param {string} packetId - The ID that uniquely identifies the Packet.
         * @param {object} data
         */
        update: (packetId, data) =>
            request.patch(`${path}/${packetId}`, data),

        /**
         * Send a Reminder email or SMS to a Signer.
         * @param {string} packetId - The ID that uniquely identifies the Packet.
         */
        remind: (packetId) => request.put(`${path}/${packetId}/remind/`),

        /**
         * Get a link and checksum of the Certificate of Evidence for this Packet
         * @param {string} packetId - The ID that uniquely identifies the Packet.
         */
        retrieveCOE: (packetId) =>
            request.get(`${path}/${packetId}/coe/`),

        /**
         * Create a URL which can be used for embedded signing.
         * @param {string} packetId - The ID that uniquely identifies the Packet.
         */
        embedUrl: (packetId) => request.post(`${path}/${packetId}/embed_url/`)
    }
}

module.exports = { PacketSubClient }