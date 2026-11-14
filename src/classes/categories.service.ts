
import { SERVER } from "../constants.ts";
import { Http } from "./http.ts";
import type { Category } from "../interfaces/category.ts";
import { type CategoriesResponse} from "../interfaces/responses.ts";

export class CategoriesService {

    #http = new Http();

    async getAll(): Promise<Category[]> {
        const resp = await this.#http.get<CategoriesResponse>(`${SERVER}/categories`);
        return resp.categories;
    }
}
