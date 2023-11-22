require('dotenv/config')
const inquirer = require('inquirer')
const chalk = require('chalk')
const { Client } = require('../../index')
const { EVENT_TYPE } = require('../blueink/constants.js')

const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY)
const webHookSample = {
  url: 'https://www.example.com/01/',
  enable: true,
  json: true,
  event_types: [
    EVENT_TYPE.EVENT_BUNDLE_LAUNCHED,
    EVENT_TYPE.EVENT_PACKET_COMPLETE
  ]
}

const webHookSampleUpdate = {
  url: 'https://www.example.com/01/',
  enabled: false,
  event_types: [EVENT_TYPE.EVENT_PACKET_VIEWED]
}

const webHookSampleExtraHeader = {
  name: 'Courage_The_Cowardly_Webhook',
  value: 'Muriel Bagge',
  order: 0
}

const interactWebhook = async () => {
  try {
    console.log(chalk.bgBlue.white('Using webhook is easy\n'))
    const action = await askAction()

    switch (action) {
      case 'Create Webhook': {
        const createResp = await client.webhooks.create(webHookSample)
        const webhook = createResp.data
        console.log(`Created webhook ${webhook.id}`)
        break
      }

      case 'Update Webhook': {
        const webhook_id = await askWebhookId() /* eslint-disable-line camelcase */
        const updateResp = await client.webhooks.update(
          webhook_id, /* eslint-disable-line camelcase */
          webHookSampleUpdate
        )
        const webhook = updateResp.data
        console.log(`Updated webhook ${webhook.id}`)
        break
      }

      case 'Create and add an ExtraHeader to the above Webhook': {
        const webhook_id = await askWebhookId() /* eslint-disable-line camelcase */
        const extraHeaderData = { ...webHookSampleExtraHeader }
        extraHeaderData.webhook = webhook_id /* eslint-disable-line camelcase */
        const createHeaderResp = await client.webhooks.createHeader(
          extraHeaderData
        )
        const header = createHeaderResp.data
        console.log(
          `Added ExtraHeader ${JSON.stringify(header)} to ${header.webhook}`
        )
        break
      }

      case 'List Webhooks': {
        const listResp = await client.webhooks.list()
        const webhookList = listResp.data
        console.log(`Found ${webhookList.length} Webhooks`)
        for (const wh of webhookList) {
          console.log(` - Webhook ID: ${wh.id} to ${wh.url}`)
        }
        break
      }

      case 'Delete Webhook': {
        const webhook_id = await askWebhookId() /* eslint-disable-line camelcase */
        await client.webhooks.delete(webhook_id) /* eslint-disable-line camelcase */
        console.log(`Deleted Webhook ${webhook_id}`) /* eslint-disable-line camelcase */
        break
      }
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response)
      console.log(chalk.bgRed.white('\nError: '), error.response.data)
    } else {
      console.log(error)
    }
  }
}

const askAction = async () => {
  const answer = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'Choose an action to continue',
    choices: [
      'Create Webhook',
      'Update Webhook',
      'Create and add an ExtraHeader to the above Webhook',
      'List Webhooks',
      'Delete Webhook'
    ]
  })
  return answer.action
}

const askWebhookId = async () => {
  console.log('\nEnter a Webhook ID')
  let webhook_id = '' /* eslint-disable-line camelcase */
  while (!webhook_id) { /* eslint-disable-line camelcase */
    const answer = await inquirer.prompt({
      name: 'webhook_id',
      type: 'input'
    })
    webhook_id = answer.webhook_id /* eslint-disable-line camelcase */
  }
  return webhook_id /* eslint-disable-line camelcase */
}

interactWebhook()
