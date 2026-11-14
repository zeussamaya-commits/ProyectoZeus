import { SERVER } from "../constants.ts";
import { Http } from "./http.ts";
import { type Product, type ProductInsert} from "../interfaces/product.ts";
import { type ProductsResponse, type SingleProductResponse } from "../interfaces/responses.ts";

export class ProductsService {

    #http = new Http();

    async getAll(): Promise<Product[]> {
        const resp = await this.#http.get<ProductsResponse>(`${SERVER}/products`);
        return resp.products;
    }

    async post(product: ProductInsert) : Promise<Product> {
        const resp = await this.#http.post<SingleProductResponse, ProductInsert>(`${SERVER}/products`, product);
        return resp.product;
    }

    async delete(id : number) : Promise<void> {
        await this.#http.delete(`${SERVER}/products/${id}`);
    }
}
