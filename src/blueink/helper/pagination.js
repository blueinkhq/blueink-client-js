import 'dotenv/config';
import has from 'lodash.has';

export class PaginationHelper {
	#response;
	#nextPages;
	#previousPages;
	#path;
	#params;
	#client;
	#pageNumber;
	#perPage;
	#totalPages;
	#totalResults;

	constructor(response, path, params, client) {
		this.#response = response;
		this.#path = path;
		this.#params = params;
		this.#client = client;
		this.#nextPages = this.getNextPage();
		this.#previousPages = this.getPreviousPage();
		this.#getPagination();

		self.page_number = int(pagination_split[0])
		self.total_pages = int(pagination_split[1])
		self.per_page = int(pagination_split[2])
		self.total_results = int(pagination_split[3])

		const instance = {
			...response,
			pagination: {
				pageNumber: this.#pageNumber,
				perPage: this.#perPage,
				totalPages: this.#totalPages,
				totalResults: this.#totalResults,
				pages: this.getNextPage(),
				nextPage: this.#getNextPage,
				previousPage: this.#getPreviousPage,
			},
		};
		return instance;
	}

	#getPagination = () => {
		if (has(this.#response.headers, 'x-blueink-pagination')) {
			const paginationHeader = this.#response.headers['x-blueink-pagination'];
			const formattedPagination = paginationHeader.split(',');

			this.#pageNumber = parseInt(formattedPagination[0]);
			this.#totalPages = parseInt(formattedPagination[1]);
			this.#perPage = parseInt(formattedPagination[2]);
			this.#totalResults = parseInt(formattedPagination[3]);
		}
	};

	*getNextPage() {
		for (let i = this.#pageNumber + 1; i <= this.#totalPages; ++i) {
			yield this.getPageContent(i);
		}
	}

	*getPreviousPage() {
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
