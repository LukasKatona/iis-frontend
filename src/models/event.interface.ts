export interface Event {
    id?: number;
    name: string;
    description: string;
    startDate: number;
    endDate: number;
    createdById: number;
    createdAt: number;

    state?: string;
    city?: string;
    street?: string;
    streetNumber?: string;
    zipCode?: string;

    isLikedByLoggedUser?: boolean;

    [key: string]: any;
}

export function createEmptyEvent(createdById: number): Event {
    return {
        name: '',
        description: '',
        startDate: 0,
        endDate: 0,
        createdById,
        createdAt: 0,

        state: '',
        city: '',
        street: '',
        streetNumber: '',
        zipCode: ''
    };
}