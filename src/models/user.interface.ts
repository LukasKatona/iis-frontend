export interface User {
    id: number;
    farmerId?: number;
    isAdmin?: boolean;
    isModerator?: boolean;
    isFarmer?: boolean;
    
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