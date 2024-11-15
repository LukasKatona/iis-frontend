export interface ProductCategory {
    id?: number;
    name: string;
    parentCategoryId?: number | null;
    children?: ProductCategory[];

    [key: string]: any;
}

export function createEmptyProductCategory(): ProductCategory {
    return {
        name: ''
    };
}