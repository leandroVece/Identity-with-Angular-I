export interface TokenType {
    token: string,
    timeExpiry: string,
}

export interface Tokens {
    tokenAcces: TokenType
    tokenRefresh: TokenType
}

export interface TokenDate {
    token: string,
    timeExpiry: Date,
}

export interface TokensWithDate {
    tokenAcces: TokenDate
    tokenRefresh: TokenDate
}

