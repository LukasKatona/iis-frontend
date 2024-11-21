export interface ProductCategory {
    id?: number;
    name: string;
    parentCategoryId?: number | null;
    atributes?: string;
    children?: ProductCategory[];

    [key: string]: any;
}

export function createEmptyProductCategory(): ProductCategory {
    return {
        name: ''
    };
}