export interface FormData {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    privacyPolicy: boolean;
    newsletter: boolean;
    providers?: string;
}

export interface FormErrors {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    privacyPolicy?: string;
    newsletter?: string;
}

export interface User {
    id?: number;
    firstname: string;
    lastname: string;
    email: string;
    isActive: boolean;
}