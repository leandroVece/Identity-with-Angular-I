import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';


import { Tokens } from '../Models/Token.models';
import { TokenService } from './TokenServices';
import { UserServices } from './userServices';
import { ROLE_CLAIM_KEY } from '../constant';




@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private tokenService: TokenService, private userServices: UserServices, private jwtHelper: JwtHelperService) { }

    isLoggedIn(): boolean {
        const token = this.tokenService.getToken();
        console.log(token)
        if (token) {
            return this.validateToken(token);
        }
        return false;
    }

    validateToken(token: Tokens): boolean {
        // Convertir la cadena de fecha a un objeto Date
        const expiryDateToken = new Date(token.tokenAcces.timeExpiry);
        const expiryDateTokenRefres = new Date(token.tokenRefresh.timeExpiry);
        //agregar las horas de la zona horaria
        var expiryToken = expiryDateToken.setHours(expiryDateToken.getHours() + 3)
        var expiryRefresh = expiryDateTokenRefres.setHours(expiryDateToken.getHours() + 3)


        // Verifica si el token ha expirado
        if (new Date(expiryToken) > new Date()) {
            return true;
        } else {
            if (new Date(expiryRefresh) < new Date()) {
                return false
            }

            this.userServices.RefreshToken(token).subscribe(response => {
                // Manejar la respuesta del servidor
                console.log(response);
            });
            return true;
        }
    }

    getUserRole(): string[] | null {
        const token = this.tokenService.getToken();
        if (token) {
            const decoded = this.jwtHelper.decodeToken(token.tokenAcces.token);
            const userRole = [decoded[ROLE_CLAIM_KEY]];

            return userRole[0];
        } else {
            return [];
        }

    }
}
