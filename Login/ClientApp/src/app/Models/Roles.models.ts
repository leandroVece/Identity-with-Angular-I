export interface Roles {
    id: string,
    name: string,
    NormalizedName: string,
    ConcurrencyStamp: string
}

export interface Claim {
    type: string;
    value: string;
}