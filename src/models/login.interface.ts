export interface Login {
    username: string;
    password: string;

    [key: string]: any;
}

export function createEmptyLogin(): Login {
    return {
        username: '',
        password: ''
    };
}