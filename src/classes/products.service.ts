import { SERVER } from "../constants.ts";
import { Http } from "./http.ts";
import { type Product, type ProductInsert } from "../interfaces/product.ts";
import {
  type ProductsResponse,
  type SingleProductResponse,
} from "../interfaces/responses.ts";

export class ProductsService {
  #http = new Http();

  async getAll(
    page: number,
    search: string,
    sort: string,
    status?: string | null,
    user?: string | null
  ): Promise<ProductsResponse> {
    const params = new URLSearchParams({ page: String(page), search, sort });
    if (status) {
      params.append("status", status);
    }
    if (user) {
      params.append("user", user);
    }
    return await this.#http.get<ProductsResponse>(
      `${SERVER}/products?${params.toString()}`
    );
  }

  async post(product: ProductInsert): Promise<Product> {
    const resp = await this.#http.post<SingleProductResponse, ProductInsert>(
      `${SERVER}/products`,
      product
    );
    return resp.product;
  }

  async delete(id: number): Promise<void> {
    await this.#http.delete(`${SERVER}/products/${id}`);
  }

  async getId(id: number): Promise<Product> {
    const resp = await this.#http.get<SingleProductResponse>(
      `${SERVER}/products/${id}`
    );
    return resp.product;
  }

  async addBookmark(id: number): Promise<void> {
    return this.#http.post<void, void>(`${SERVER}/products/${id}/bookmarks`);
  }

  async removeBookmark(id: number): Promise<void> {
    return this.#http.delete(`${SERVER}/products/${id}/bookmarks`);
  }
}
