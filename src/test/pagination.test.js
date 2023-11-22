require('dotenv/config')
const { Client } = require('../../index')

const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY)

describe('Pagination', () => {
  it('Iterator', async () => {
    const pageList = await client.bundles.pagedList({
      related_data: false,
      page: 2,
      per_page: 2
    })
    let i = 2
    console.log(pageList.pages)
    for (const page of pageList.pages) {
      ++i
      const pageData = await page
      expect(pageData.pageNumber).toBe(i)
    }
  })

  it('Get Next Page', async () => {
    const pageList = await client.bundles.pagedList({
      page: 2,
      per_page: 2
    })
    const nextPage = await pageList.nextPage()
    expect(nextPage.pageNumber).toBe(3)
  })

  it('Get Previous Page', async () => {
    const pageList = await client.bundles.pagedList({
      page: 3,
      per_page: 20
    })
    const nextPage = await pageList.previousPage()
    expect(nextPage.pageNumber).toBe(2)
  })
})
