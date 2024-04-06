import { TokenType } from "@angular/compiler";
import { TokenDate, TokensWithDate, Tokens } from "../Models/Token.models";

export class TokenService {

    constructor() { }

    saveToken(token: Tokens) {
        console.log(token);
        const stringConvert = JSON.stringify(token);
        localStorage.setItem('token', stringConvert);
    }

    getToken(): Tokens | null {
        const token = localStorage.getItem('token');
        if (token) {
            return JSON.parse(token);
        }
        return null;
    }

    convertToken(tokens: Tokens): TokensWithDate | null {
        const tokenAccesWithDate: TokenDate = {
            token: tokens.tokenAcces.token,
            timeExpiry: new Date(tokens.tokenAcces.timeExpiry)
        };
        const tokenRefreshWithDate: TokenDate = {
            token: tokens.tokenRefresh.token,
            timeExpiry: new Date(tokens.tokenRefresh.timeExpiry)
        };
        const tokensWithDate: TokensWithDate = {
            tokenAcces: tokenAccesWithDate,
            tokenRefresh: tokenRefreshWithDate
        };
        return tokensWithDate;
    }

}