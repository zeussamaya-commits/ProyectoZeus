import type { Product } from "./product";
import type { User } from "./user";

export interface RatingInsert {
    rating: number;
    comment: string;
    product: number;
}

export interface Rating extends Omit<RatingInsert, "product"> {
    product: Product;
    user: User; 
}
