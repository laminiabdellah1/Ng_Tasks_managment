export interface User{
    id: number;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    token?: string;
}

export interface LoginRequest{
    username: string;
    password: string;
}

export interface RegisterRequest{
    username: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
}