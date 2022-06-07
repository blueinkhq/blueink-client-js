import isEmpty from 'lodash.isempty';

export class PaginationHelper {
	#params;
	#pagedRequest;
	#lastPagination;

	/**
	 *
	 * @param {*} pagedRequest
	 * @param {*} params
	 * @returns iterator function
	 */
	constructor(pagedRequest, params) {
		this.#params = params;
		this.#pagedRequest = pagedRequest;
		this.#lastPagination = {};

		return this.yieldNextPage();
	}

	async *yieldNextPage() {
		let currentPage = this.#params.page;
		while (isEmpty(this.#lastPagination) || currentPage <= this.#lastPagination.totalPages) {
			yield await this.getPageContent(currentPage);
			currentPage++;
		}
	}

	async getPageContent(pageNumber) {
		const response = await this.#pagedRequest({ ...this.#params, page: pageNumber });
		this.#lastPagination = response.pagination;
		return response;
	};
}
