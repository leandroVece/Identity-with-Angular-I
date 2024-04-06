import { Roles, Claim } from "./Roles.models";

export interface UserResponse {
    Id: string;
    UserName: string;
    Email: string;
    EmailConfirmed: boolean;
    PhoneNumber: string;
    PhoneNumberConfirmed: boolean;
    //Roles: Roles[]
    Claim: Claim[]
    TwoFactorEnabled: number;
    TokenRefresh: string,
    TokenRefreshExpiry: Date

}

export interface UserRegister {
    UserName: string,
    password: string,
    Email: string,
    Roles: string[]

}

export interface PasswordReset {
    Password: string,
    ResetPasword: string,
    Email: string,
    Token: string
}

export interface UserLogin {
    userName: string,
    password: string,

}
export interface UserTwoFactoryLogin {
    email: string,
    TowFactory: boolean,
}


