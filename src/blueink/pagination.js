import { BlueInkClient } from "./index.js";
import "dotenv/config";
const has = Object.prototype.hasOwnProperty;

export class PaginationHelper {
	#response;
	#pages;
	#path;
	#params;
	#client;
	#currentPage;
	#perPage;
	#totalPages;
	#totalResults;

	constructor(response, path, params, client) {
		this.#response = response;
		this.#path = path;
		this.#params = params;
		this.#client = client;
		this.#getPagination();
		this.#pages = this.#getNextPage();
		const instance = {
			data: response.data,
			currentPage: this.#currentPage,
			perPage: this.#perPage,
			totalPages: this.#totalPages,
			totalResults: this.#totalResults,
			nextPage: this.#nextPage,
			pages: this.getNext(),
			queryParams: this.#params,
		};
		return instance;
	}

	#getPagination = () => {
		if (has.call(this.#response.headers, "x-blueink-pagination")) {
			const paginationHeader = this.#response.headers["x-blueink-pagination"];
			const formattedPagination = paginationHeader.split(",");

			this.#currentPage = parseInt(formattedPagination[0]);
			this.#totalPages = parseInt(formattedPagination[1]);
			this.#perPage = parseInt(formattedPagination[2]);
			this.#totalResults = parseInt(formattedPagination[3]);
		}
	};

	*#getNextPage() {
		for (let i = this.#currentPage + 1; i <= this.#totalPages; ++i) {
			yield i;
		}
	}

	*getNext() {
		for (let i = this.#currentPage + 1; i <= this.#totalPages; ++i) {
			yield yield this.getNextPageContent(i);
		}
	}

	getNextPageContent = (pageNumber) => {
		switch (this.#path) {
			case "/bundles/":
				return this.#client.bundles.pagedList({
					...this.#params,
					page: pageNumber,
				});
			case "/persons/":
				return this.#client.persons.pagedList({
					...this.#params,
					page: pageNumber,
				});
			case "/templates/":
				return this.#client.templates.pagedList({
					...this.#params,
					page: pageNumber,
				});
		}
	};

	#nextPage = () => {
		const nextPage = this.#pages.next();
		if (!nextPage.done) {
			return this.getNextPageContent(nextPage.value);
		}
	};
}
