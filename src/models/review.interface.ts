export interface Review {
    id: number;
    userId: number;
    productId?: number;
    orderId?: number;
    rating: number;
    review?: string;
    createdAt: string;
}
