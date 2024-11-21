export interface User {
    id?: number;
    farmerId?: number;
    isAdmin?: boolean;
    isModerator?: boolean;
    isFarmer?: boolean;
    isActive?: boolean;
    
    name: string;
    surname: string;
    email: string;
    password: string;
    phone?: string;
    imageUrl?: string;

    state?: string;
    city?: string;
    street?: string;
    streetNumber?: string;
    zipCode?: string;

    [key: string]: any;
}

export function createEmptyUser(): User {
    return {
        name: '',
        surname: '',
        email: '',
        password: '',
        phone: '',
        imageUrl: '',
        state: '',
        city: '',
        street: '',
        streetNumber: '',
        zipCode: '',
        isAdmin: false,
        isModerator: false,
        isFarmer: false,
        isActive: true
    };
}