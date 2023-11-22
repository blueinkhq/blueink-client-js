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
    const templateId = '5703cfb0-970d-4950-b6d0-9f9d70d9168f'
    const { status } = await client.templates.retrieve(templateId)
    expect(status).toBe(200)
  })
})
