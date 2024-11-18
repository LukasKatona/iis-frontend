import { Product } from './product.interface';

export interface ProductWithQuantity {
    product: Product;
    quantity: number;
}