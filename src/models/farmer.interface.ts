export interface Farmer {
    id?: number;
    userId: number;
    farmName?: string;
    description?: string;

    CIN: string;
    VATIN: string;
    VAT: string;
    paysVat: boolean;

    bankCode: string;
    accountNumber: string;
    iban?: string;

    state?: string;
    city?: string;
    street?: string;
    streetNumber?: string;
    zipCode?: string;

    [key: string]: any;
}

export function createEmptyFarmer(userId: number): Farmer {
    return {
        userId,
        farmName: '',
        description: '',
        CIN: '',
        VATIN: '',
        VAT: '',
        paysVat: false,
        bankCode: '',
        accountNumber: '',
        iban: '',
        state: '',
        city: '',
        street: '',
        streetNumber: '',
        zipCode: ''
    };
}