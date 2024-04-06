import { Component } from '@angular/core';
import { Router, Route } from '@angular/router';
import { AuthService } from '../../services/AuthServices.services';


import { routes } from '../app-routing.module';
import { permissions } from '../permissions';


@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})

export class NavComponent {

    paths: Route[];
    isLogin!: boolean;

    constructor(private router: Router, private authService: AuthService) {
        this.paths = routes[0].children!.filter(route => !!route.path);
        this.isLogin = this.authService.isLoggedIn();
    }

    // Si necesitas navegar a una ruta desde el componente
    navigateTo(path: string) {
        this.router.navigate([path]);
    }

    //hice los cambios pero no los probe
    hasPermission(routePath: string): boolean {

        const currentUserRole = this.authService.getUserRole();
        if (currentUserRole) {
            const permission = permissions[routePath as keyof typeof permissions];
            const roles = Array.isArray(currentUserRole) ? currentUserRole : [currentUserRole];
            if (!this.isLogin) {
                // Allow non-logged-in users for specific routes
                return permission === 'No logueado';
            } else {
                // Check if user role is included in permitted roles for the route
                const userRole = roles.some(role => permission.includes(role));
                return !!permission && userRole;
            }
        }
        return false;
    }

}