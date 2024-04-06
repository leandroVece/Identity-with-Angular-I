import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Roles } from '../Models/Roles.models';
import { PasswordReset, UserLogin, UserRegister, UserResponse, UserTwoFactoryLogin } from '../Models/User.Models';
import { Tokens, TokensWithDate } from '../Models/Token.models';

import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


import { environment } from 'src/environments/environment';
import { ApiResponse, Response } from '../Models/ApiResponse.models';

import { TokenService } from './TokenServices';



@Injectable({
    providedIn: 'root'
})
export class UserServices {

    constructor(private http: HttpClient,
        private TokenService: TokenService) { }

    getRoles(): Observable<Roles[]> {
        return this.http.post<Roles[]>(`${environment.Api_url}/Admin`, null)
            .pipe(catchError(error => {
                //console.log('Error en la solicitud:', error);
                return throwError(() => new Error(error));
            }));
    }

    Register(data: UserRegister): Observable<ApiResponse<UserResponse>> {
        return this.http.post<ApiResponse<UserResponse>>(`${environment.Api_url}/Authentication/register`, data)
            .pipe(catchError(error => {
                return throwError(() => new Error(error));
            }))
    }

    Login(data: UserLogin): Observable<ApiResponse<Tokens>> {
        return this.http.post<ApiResponse<Tokens>>(`${environment.Api_url}/Authentication/login`, data)
            .pipe(tap(op => {
                if (op.response) {
                    this.TokenService.saveToken(op.response);
                }
            }))
    }

    RefreshToken(data: Tokens): Observable<TokensWithDate> {
        const tokens = this.TokenService.convertToken(data);

        return this.http.post<TokensWithDate>(`${environment.Api_url}/Authentication/refresh-token`, tokens)
            .pipe(
                tap(op => {
                    console.log(op)
                    if (op) {
                        tokens!.tokenAcces = op.tokenAcces;
                        this.TokenService.saveToken(data);
                    }
                }),
                catchError(error => {
                    console.log(error);
                    return throwError(() => new Error(error));
                })
            );
    }

    Settings(data: UserTwoFactoryLogin): Observable<Response> {
        return this.http.post<Response>(`${environment.Api_url}/Admin/settings`, data)
            .pipe(catchError(error => {
                return throwError(() => new Error(error));
            }));
    }

    ForgotPassword(email: string): Observable<Response> {
        return this.http.post<Response>(`${environment.Api_url}/Authentication/Forgot-password`, email)
            .pipe(catchError(error => {
                return throwError(() => new Error(error));
            }));
    }

    ResetPassword(data: PasswordReset): Observable<Response> {
        return this.http.post<Response>(`${environment.Api_url}/Authentication/reset-password`, data)
            .pipe(catchError(error => {
                return throwError(() => new Error(error));
            }));
    }


}

