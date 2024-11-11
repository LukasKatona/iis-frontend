import { OrderStatus } from './order-status.enum';

export interface Order {
    id: number;
    orderNumber: string;
    userId?: number;  
    farmerId?: number;  
    reviewId?: number; 
    status: OrderStatus; 
    createdAt: number; 
    updatedAt?: number;
    suppliedAt?: number;
}
