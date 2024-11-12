export interface Farmer {
    id: number;
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