import { Role } from './role.enum';

export interface User {
    id: number;
    farmerId?: number;
    role: Role;
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