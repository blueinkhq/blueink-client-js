import { BlueInkClient } from "./index.js";
import "dotenv/config";
const has = Object.prototype.hasOwnProperty;

export class PaginationHelper {
	#response;
	#pagination;
	#pages;
	#path;
	#params;
	#client;
	constructor(response, path, params, client) {
		this.#response = response;
		this.#path = path;
		this.#params = params;
		this.#client = client;
		this.#pagination = this.#getPagination();
		this.#pages = this.#getNextPage();
		const instance = {
			data: response.data,
			pagination: this.#pagination,
			nextPage: this.#nextPage,
		};
		return instance;
	}

	#getPagination = () => {
		if (has.call(this.#response.headers, "x-blueink-pagination")) {
			const paginationHeader = this.#response.headers["x-blueink-pagination"];
			const formattedPagination = paginationHeader.split(",");
			const pagination = {
				current_page: parseInt(formattedPagination[0]),
				total_pages: parseInt(formattedPagination[1]),
				per_page: parseInt(formattedPagination[2]),
				total_results: parseInt(formattedPagination[3]),
			};
			return pagination;
		}
	};

	*#getNextPage() {
		for (
			let i = this.#pagination.current_page + 1;
			i <= this.#pagination.total_pages;
			++i
		) {
			yield i;
		}
	}

	#nextPage = () => {
		console.log(this.#path);
		const nextPage = this.#pages.next();
		if (!nextPage.done) {
			switch (this.#path) {
				case "/bundles/":
					return this.#client.bundles.list({
						...this.#params,
						page: nextPage.value,
					});
				case "/persons/":
					return this.#client.persons.list({
						...this.#params,
						page: nextPage.value,
					});
				case "/templates/":
					return this.#client.templates.list({
						...this.#params,
						page: nextPage.value,
					});
			}
			// return this.#client.bundles.list({
			// 	...this.#params,
			// 	page: nextPage.value,
			// });
		} else {
			return "You reached the last page.";
		}
	};
}
