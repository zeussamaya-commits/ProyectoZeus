import type { Category } from "./category";
import type { Photo } from "./photo";
import type { User } from "./user";

type Status = 1 | 2 | 3;

export interface ProductInsert {
    title: string;
    description: string;
    category: number;
    price: number;
    mainPhoto: string;
}

export interface TransactionRating {
    sellerRating?: number;
    buyerRating?: number;
    sellerComment?: string;
    buyerComment?: string;
    dateTransaction?: string;
}

export interface Product extends Omit<ProductInsert, "category"> {
    id: number;
    category: Category;
    datePublished: string;
    status: Status;
    numVisits: number;
    owner: User;
    soldTo?: User;
    rating?: TransactionRating;
    photos?: Photo[];
    distance: number; 
    mine: boolean;
    bookmarked: boolean;
}
