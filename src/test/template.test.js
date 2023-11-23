import dotenv from 'dotenv'
import { Client } from '../../index.js'

dotenv.config()
const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY)

describe('Templates', () => {
  it('List all Templates', async () => {
    const { status } = await client.templates.list()
    return expect(status).toBe(200)
  })

  it('Retrieve a Template', async () => {
    const { data } = await client.templates.list()
    const templateId = data[0].id
    const { status } = await client.templates.retrieve(templateId)
    expect(status).toBe(200)
  })
})
