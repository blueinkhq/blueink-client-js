const isEmpty = require('lodash.isempty')

class PaginationHelper {
  #params
  #pagedRequest
  #lastPagination

  /**
   *
   * @param {*} pagedRequest
   * @param {*} params
   * @returns iterator function
   */
  constructor (pagedRequest, params) {
    this.#params = params
    this.#pagedRequest = pagedRequest
    this.#lastPagination = {}
    return this.yieldNextPage()
  }

  async * yieldNextPage () {
    let currentPage = this.#params.page
    console.log(this.#lastPagination)
    while (
      isEmpty(this.#lastPagination) ||
      currentPage <= this.#lastPagination.totalPages
    ) {
      yield await this.getPageResponse(currentPage)
      currentPage++
    }
  }

  async getPageResponse (pageNumber) {
    const response = await this.#pagedRequest({
      ...this.#params,
      page: pageNumber
    })
    this.#lastPagination = response.pagination
    return response
  }
}

module.exports = PaginationHelper
