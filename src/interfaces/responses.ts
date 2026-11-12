import type { Category } from "./category";
import type { Product } from "./product";
import type { Rating } from "./rating";
import type { User } from "./user";

export interface CategoriesResponse {
    categories: Category[];
}

export interface ProductsResponse {
    products: Product[];
    page: number;
    total_pages: number;
    total_products: number;
}

export interface SingleProductResponse {
    product: Product;
}

export interface TokenResponse {
    accessToken: string;
}

export interface UserResponse {
    user: User;
}

export interface UsersResponse {
    users: User[];
}

export interface PhotoResponse {
    photo: string;
}

export interface RatingsResponse {
    ratings: Rating[];
}

export interface SingleRatingResponse {
    rating: Rating;
}