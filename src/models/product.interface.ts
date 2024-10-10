import { Unit } from './unit.enum';

export interface Product {
    id: number;
    name: string;
    imageUrl?: string;
    unit: Unit;
    unitPrice: number;
    stock: number;
    categoryId: number;
}