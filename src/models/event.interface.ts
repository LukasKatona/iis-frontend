export interface Event {
    id: number;
    name: string;
    description: string;
    startDate: number;
    endDate: number;
    createdBId: number;
    createdAt: number;

    state?: string;
    city?: string;
    street?: string;
    streetNumber?: string;
    zipCode?: string;

    isLikedByLoggedUser?: boolean;
}