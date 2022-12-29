import { BlueInkClient } from '../index.js'
import 'dotenv/config'
const has = Object.prototype.hasOwnProperty

export class PaginationHelper {
  #response
  #nextPages
  #previousPages
  #path
  #params
  #client
  #currentPage
  #perPage
  #totalPages
  #totalResults

  constructor (response, path, params, client) {
    this.#response = response
    this.#path = path
    this.#params = params
    this.#client = client
    this.#nextPages = this.getNextPage()
    this.#previousPages = this.getPreviousPage()
    this.#getPagination()
    const instance = {
      ...response,
      currentPage: this.#currentPage,
      perPage: this.#perPage,
      totalPages: this.#totalPages,
      totalResults: this.#totalResults,
      queryParams: this.#params,
      pages: this.getNextPage(),
      nextPage: this.#getNextPage,
      previousPage: this.#getPreviousPage
    }
    return instance
  }

  #getPagination = () => {
    if (has.call(this.#response.headers, 'x-blueink-pagination')) {
      const paginationHeader = this.#response.headers['x-blueink-pagination']
      const formattedPagination = paginationHeader.split(',')

      this.#currentPage = parseInt(formattedPagination[0])
      this.#totalPages = parseInt(formattedPagination[1])
      this.#perPage = parseInt(formattedPagination[2])
      this.#totalResults = parseInt(formattedPagination[3])
    }
  };

  * getNextPage () {
    for (let i = this.#currentPage + 1; i <= this.#totalPages; ++i) {
      yield this.getPageContent(i)
    }
  }

  * getPreviousPage () {
    for (let i = this.#currentPage - 1; i >= 1; --i) {
      yield this.getPageContent(i)
    }
  }

  getPageContent = (pageNumber) => {
    switch (this.#path) {
      case '/bundles/':
        return this.#client.bundles.pagedList({
          ...this.#params,
          page: pageNumber
        })
      case '/persons/':
        return this.#client.persons.pagedList({
          ...this.#params,
          page: pageNumber
        })
      case '/templates/':
        return this.#client.templates.pagedList({
          ...this.#params,
          page: pageNumber
        })
    }
  }

  #getNextPage = () => {
    const nextPage = this.#nextPages.next()
    if (!nextPage.done) {
      return nextPage.value
    } else {
      throw new Error('Invalid page.')
    }
  }

  #getPreviousPage = () => {
    const previousPage = this.#previousPages.next()
    if (!previousPage.done) {
      return previousPage.value
    } else {
      throw new Error('Invalid page.')
    }
  }
}
