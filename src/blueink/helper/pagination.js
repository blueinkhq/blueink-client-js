export class PaginationHelper {
	#response;
	#nextPages;
	#previousPages;
	#path;
	#params;
	#client;
	#pageNumber;
	#totalPages;

	constructor(response, path, params, client) {
		this.#response = response;
		this.#path = path;
		this.#params = params;
		this.#client = client;
		this.#nextPages = this.yieldNextPage();
		this.#previousPages = this.yieldPreviousPage();

		const instance = {
			...response,
			pages: this.yieldNextPage(),
			nextPage: this.#getNextPage,
			previousPage: this.#getPreviousPage,
		};

		return instance;
	}

	*yieldNextPage() {
		for (let i = this.#pageNumber + 1; i <= this.#totalPages; ++i) {
			yield this.getPageContent(i);
		}
	}

	*yieldPreviousPage() {
		for (let i = this.#pageNumber - 1; i >= 1; --i) {
			yield this.getPageContent(i);
		}
	}

	getPageContent = (pageNumber) => {
		switch (this.#path) {
			case '/bundles/':
				return this.#client.bundles.pagedList({
					...this.#params,
					page: pageNumber,
				});
			case '/persons/':
				return this.#client.persons.pagedList({
					...this.#params,
					page: pageNumber,
				});
			case '/templates/':
				return this.#client.templates.pagedList({
					...this.#params,
					page: pageNumber,
				});
		}
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
