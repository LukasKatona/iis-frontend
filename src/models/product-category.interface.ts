export interface ProductCategory {
    id: number;
    name: string;
    parentCategoryId?: number;
    children?: ProductCategory[];
}