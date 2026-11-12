import { SERVER } from "../constants.ts";
import { Http } from "./http.class.ts";
import { type ProductsResponse, type Product, type SingleProductResponse } from "../interfaces/product.ts";
import { type ProductPost } from "../interfaces/product.ts";

export class ProductsService {

    #http = new Http();

    async getAll(): Promise<Product[]> {
        const resp = await this.#http.get<ProductsResponse>(`${SERVER}/products`);
        return resp.products;
    }

    async post(product: ProductPost) : Promise<Product> {
        const resp = await this.#http.post<SingleProductResponse, ProductPost>(`${SERVER}/products`, product);
        return resp.product;
    }

    async delete(id : number) : Promise<void> {
        await this.#http.delete(`${SERVER}/products/${id}`);
    }
}
