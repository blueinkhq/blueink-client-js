require('dotenv/config')
const chalk = require('chalk')
const inquirer = require('inquirer')

const { Client } = require('../../index')

const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY)

console.log(chalk.bgBlue.white('Listing Bundles is easy \n'))

const askAction = async () => {
  const answer = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'Choose an action to continue',
    choices: ['List Bundles', 'List Bundles with Pagination', 'List Bundles using Iterator']
  })
  return answer.action
}

const askRelatedData = async () => {
  const answer = await inquirer.prompt({
    name: 'related_data',
    type: 'confirm',
    default: false,
    message: 'Do you want related data?'
  })
  return answer.related_data /* eslint-disable-line camelcase */
}

const askPagination = async () => {
  const { page } = await inquirer.prompt({
    name: 'page',
    type: 'number',
    message: 'Page number',
    default () {
      return 1
    }
  })
  /* eslint-disable camelcase */
  const { per_page } = await inquirer.prompt({
    name: 'per_page',
    type: 'number',
    message: 'Number of result per page',
    default () {
      return 10
    }
  })
  return {
    page,
    per_page
  }
  /* eslint-enable camelcase */
}

const askFetchPage = async (page) => {
  const { answer } = await inquirer.prompt({
    name: 'answer',
    type: 'confirm',
    message: `Do you want to fetch the ${page} page?`
  })
  return answer
}

function logFetchSuccess (response, printIds = false) {
  /* eslint-disable no-tabs */
  console.log(chalk.bgGreen.black(
		`Fetched page ${response.pagination.pageNumber} of ${response.pagination.totalPages} total pages` +
		` (${response.pagination.perPage} results per page, ${response.pagination.totalResults} total Results).`
  ))
  /* eslint-enable no-tabs */
  if (printIds) {
    for (const b of response.data) {
      console.log(`Bundle ${b.id} ${b.status}`)
    }
  }
}

/*
EXAMPLE of Listing Bundles
Same methods are applied to Persons and Templates
*/

const listBundles = async () => {
  try {
    const action = await askAction()
    const related_data = await askRelatedData() /* eslint-disable-line camelcase */

    switch (action) {
      case 'List Bundles': {
        // Regular list with default 50 results per page.
        // related_data: boolean
        const response = await client.bundles.list({
          related_data /* eslint-disable-line camelcase */
        })
        logFetchSuccess(response)
        console.log('Showing first result:')
        console.log(response.data[0])
        break
      }
      case 'List Bundles with Pagination': {
        const pagination = await askPagination()

        // Example how to paged list.
        // related_data: boolean
        const pageIterator = client.bundles.pagedList({
          related_data, /* eslint-disable-line camelcase */
          page: pagination.page,
          per_page: pagination.per_page
        })

        // Navigate through pages by explicitly calling next() on the iterator
        let fetchNextPage = true
        while (fetchNextPage) {
          // Fetch the next page by calling next();
          const { value: response, done } = await pageIterator.next()
          if (done) {
            break
          }
          logFetchSuccess(response, true)
          fetchNextPage = await askFetchPage('next')
        }

        break
      }
      case 'List Bundles using Iterator': {
        const pagination = await askPagination()

        // Example how to fetch bundles using iterator
        // related_data: boolean
        const pages = client.bundles.pagedList({
          related_data, /* eslint-disable-line camelcase */
          page: pagination.page,
          per_page: pagination.per_page
        })

        for await (const response of pages) {
          logFetchSuccess(response, true)
        }
        break
      }
    }
  } catch (error) {
    console.log(chalk.bgRed.white('\nError: '))
    if (error.response) {
      console.log(error.response)
      console.log(error.response.data)
    } else {
      console.log(error)
    }
  }
}

listBundles()
