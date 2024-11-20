export interface Atribute {
    id?: number;
    name: string;
    type: string;
    isRequired: boolean;

    [key: string]: any;
}

export function createEmptyAtribute(): Atribute {
    return {
        name: '',
        type: '',
        isRequired: false
    };
}