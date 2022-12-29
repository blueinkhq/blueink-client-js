import { BundleHelper } from './src/blueink/bundle/bundleHelper.js'
import { BlueInkClient } from './src/blueink/index.js'
import 'dotenv/config'

const client = new BlueInkClient(process.env.BLUEINK_PRIVATE_API_KEY)
const sentBundleId = 'w5cpHdvRoN'
const completedBundleId = 'ReGx0JSafZ'
const canceledBundleId = 'e1aswoGKQ9'
const personId = '1ca04018-2996-454b-a938-412bcd5168da'
let createdBundle = ''

console.log('=Testing API JS Library=')

const testHarness = async (funcToTest) => {
  const successCode = [201, 200]
  try {
    const [statusCode, data] = await funcToTest()

    if (successCode.includes(statusCode)) {
      console.log('=> Success!')
    } else {
      console.log('=> Error: Status', statusCode)
    }
  } catch (error) {
    console.log(
			`=> Error (status ${
				error.response
					? error.response.status + JSON.stringify(error.response.data)
					: '??'
			})`
    )
  }
}

await testHarness(async () => {
  console.log('\n== List Bundles ==')
  const { status, data } = await client.bundles.list()
  return [status, data]
})

await testHarness(async () => {
  console.log('\n== Retrieve a Bundle ==')
  const { status, data } = await client.bundles.retrieve(sentBundleId)
  return [status, data]
})

await testHarness(async () => {
  console.log('\n== List Bundle Events ==')
  const { status, data } = await client.bundles.listEvents(sentBundleId)
  return [status, data]
})

await testHarness(async () => {
  console.log('\n== List Completed Bundle Data ==')
  const { status, data } = await client.bundles.listData(completedBundleId)
  return [status, data]
})

await testHarness(async () => {
  console.log('\n== Create a Bundle with file_url ==')
  const nbh = new BundleHelper({
    label: 'Test Label',
    requester_email: 'tps.reports@example.com',
    requester_name: 'Mr. Example',
    email_subject: 'Yay First Bundle',
    email_message: 'This is your first bundle.'
  })
  const docKey1 = nbh.addDocument({
    key: 'DOC-1',
    file_url: 'https://www.irs.gov/pub/irs-pdf/fw4.pdf'
  })

  const signer1 = nbh.addSigner({
    name: 'Testing',
    email: 'peter.gibbons@example.com'
  })

  const field = nbh.addField(docKey1, {
    label: 'Your Name',
    page: 1,
    kind: 'txt',
    editors: [signer1],
    x: 15,
    y: 60,
    w: 20,
    h: 3
  })
  const { status, data } = await client.bundles.create(nbh.asData())
  return [status, data]
})

await testHarness(async () => {
  console.log('\n== Create a Bundle with file_path ==')
  const nbh = new BundleHelper({
    label: 'Test Label',
    requester_email: 'tps.reports@example.com',
    requester_name: 'Mr. Example',
    email_subject: 'Yay First Bundle',
    email_message: 'This is your first bundle.'
  })

  const signer1 = nbh.addSigner({
    name: 'Testing',
    email: 'peter.gibbons@example.com'
  })

  const docKey2 = nbh.addDocument({
    key: 'DOC-2',
    file_path: './fw9.pdf'
  })

  nbh.addField(docKey2, {
    label: 'Your Name',
    page: 1,
    kind: 'txt',
    editors: [signer1],
    x: 15,
    y: 60,
    w: 20,
    h: 3
  })
  const { status, data } = await client.bundles.create(nbh.asData())
  createdBundle = data.id
  return [status, data]
})

await testHarness(async () => {
  console.log('\n== Cancel a Bundle ==')
  const { status, data } = await client.bundles.cancel(createdBundle)
  return [status, data]
})

await testHarness(async () => {
  console.log('\n== List Persons ==')
  const { status, data } = await client.persons.list()
  return [status, data]
})

await testHarness(async () => {
  console.log('\n== Retrieve a Person ==')
  const { status, data } = await client.persons.retrieve(personId)
  return [status, data]
})
