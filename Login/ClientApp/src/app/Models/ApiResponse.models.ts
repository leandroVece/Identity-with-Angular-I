export interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    status: number;
    response: T | null;
}

export interface Response {
    status: string,
    message: string
}