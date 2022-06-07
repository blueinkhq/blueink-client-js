export class PaginationHelper {
	#nextPages;
	#previousPages;
	#params;
	#pageNumber;
	#pagedRequest;
	#lastResponse;

	/**
	 *
	 * @param {*} pagedRequest
	 * @param {*} params
	 * @returns iterator function
	 */
	constructor(pagedRequest, params) {
		this.#params = params;
		this.#pagedRequest = pagedRequest;

		this.#lastResponse = {};

		return this.yieldNextPage();
	}

	*yieldNextPage() {
		let currentPage = this.#params.page;
		while (!this.#lastResponse.totalPages || currentPage <= this.#lastResponse.totalPages) {
			yield this.getPageContent(currentPage);
			currentPage++;
		}
	}

	*yieldPreviousPage() {
		if (!this.#lastResponse) {
			for (let i = this.#pageNumber - 1; i >= 1; --i) {
				yield this.getPageContent(i);
			}
		}
	}

	getPageContent = (pageNumber) => {
		const promise = this.#pagedRequest({ ...this.#params, page: pageNumber });
		promise.then((res) => {
			this.#lastResponse = res.pagination;
		});
		return promise;
	};

	#getNextPage = () => {
		const nextPage = this.#nextPages.next();
		if (!nextPage.done) {
			return nextPage.value;
		} else {
			throw new Error('Invalid page.');
		}
	};

	#getPreviousPage = () => {
		const previousPage = this.#previousPages.next();
		if (!previousPage.done) {
			return previousPage.value;
		} else {
			throw new Error('Invalid page.');
		}
	};
}
