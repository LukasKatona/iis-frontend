export interface Register {
    username: string;
    password: string;
    name: string;
    surname: string;
    email: string;
    [key: string]: any;
}

export function createEmptyRegister(): Register {
    return {
        username: '',
        password: '',
        name: '',
        surname: '',
        email: ''
    };
}