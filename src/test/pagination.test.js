import dotenv from 'dotenv'
import { Client } from '../../index.js'

dotenv.config()
const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY)

describe('Pagination', () => {
  let page
  let pageList
  beforeEach(() => {
    page = 1
    pageList = client.bundles.pagedList({
      page,
      per_page: 10
    })
  })

  it('Iterator', async () => {
    // Navigate through pages by explicitly calling next() on the iterator
    let fetchNextPage = true
    while (fetchNextPage) {
      const { value: response } = await pageList.next()
      const { pageNumber, totalPages } = response.pagination
      expect(pageNumber).toBe(page)
      if (pageNumber === totalPages) {
        fetchNextPage = false
      } else {
        page++
      }
    }
  })

  it('Get Next Page', async () => {
    await pageList.next() // call to fetch first page data
    const { value: nextPageValue } = await pageList.next()
    const nextPageNumber = await nextPageValue.pagination.pageNumber
    expect(nextPageNumber).toBe(page + 1)
  })
})
