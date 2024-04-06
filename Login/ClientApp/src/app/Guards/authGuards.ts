import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/AuthServices.services';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean {
        if (this.authService.isLoggedIn()) {
            //this.router.navigate(['/settings']);
            return true;
        } else {
            //this.router.navigate(['/home']); // Redirige al usuario a la página de inicio de sesión si no está autenticado
            return false;
        }
    }

}