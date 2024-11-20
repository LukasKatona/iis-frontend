import { Product } from './product.interface';
import { Review } from './review.interface';

export interface ProductWithQuantity {
    product: Product;
    quantity: number;
    review: Review | null;
}