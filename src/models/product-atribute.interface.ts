export interface ProductAtribute {
    id?: number;
    name: string;
    value: string | number | boolean | null;

    [key: string]: any;
}

export function createEmptyAtribute(): ProductAtribute {
    return {
        name: '',
        value: null
    };
}