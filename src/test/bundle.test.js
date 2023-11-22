require('dotenv/config')
const { Client } = require('../../index.js')

const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY)
const sentBundleId = process.env.SENT_BUNDLE_ID
const completedBundleId = process.env.COMPLETED_BUNDLE_ID

describe('Bundles', () => {
  it('List all Bundles', async () => {
    const { status } = await client.bundles.list({ status: 'co' })
    expect(status).toBe(200)
  })

  it('Retrieve a Bundle', async () => {
    const { status } = await client.bundles.retrieve(sentBundleId)
    expect(status).toBe(200)
  })

  it('List Bundle Events', async () => {
    const { status } = await client.bundles.listEvents(sentBundleId)
    expect(status).toBe(200)
  })

  it('List Completed Bundle Data', async () => {
    const { status } = await client.bundles.listData(
      completedBundleId
    )
    expect(status).toBe(200)
  })
})
