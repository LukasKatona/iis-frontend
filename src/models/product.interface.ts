import { Unit } from './unit.enum';

export interface Product {
    id?: number;
    name: string;
    imageUrl?: string;
    unit: Unit;
    unitPrice: number;
    stock: number;
    categoryId: number | null;
    farmerId: number;
    rating?: number;
    categoryAtributes?: string;

    [key: string]: any;
}

export function createEmptyProduct(farmerId: number): Product {
    return {
        name: '',
        imageUrl: '',
        unit: Unit.KILOGRAM,
        unitPrice: 0,
        stock: 0,
        categoryId: null,
        farmerId,
    };
}