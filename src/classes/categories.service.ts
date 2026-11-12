
import { SERVER } from "../constants.ts";
import { Http } from "./http.class.ts";
import { type CategoriesResponse, type Category } from "../interfaces/category.ts";

export class CategoriesService {

    #http = new Http();

    async getAll(): Promise<Category[]> {
        const resp = await this.#http.get<CategoriesResponse>(`${SERVER}/categories`);
        return resp.categories;
    }
}
