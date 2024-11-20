export interface Review {
    id?: number;
    userId: number;
    productId: number | null;
    orderId: number;
    rating: number | null;
    createdAt?: string;
}

export function createEmptyReview(userId: number, orderId: number, productId: number | null): Review {
    return {
        userId: userId,
        productId: productId,
        orderId: orderId,
        rating: null,
    };
}
