import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { LayoutComponent } from './layout/layout.component';
import { NotFoundComponent } from './error/error.component';
import { ForgotPasswordComponent } from './Forgot-password/Forgot-password.component';
import { ResetPasswordComponent } from './Reset-password/Reset-password.component';
import { AuthGuard } from '../Guards/authGuards';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '', redirectTo: '/home', pathMatch: 'full'
            },
            { path: 'home', component: HomeComponent },
            { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
            { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [AuthGuard] },
            { path: 'reset-password', component: ResetPasswordComponent, canActivate: [AuthGuard] }
        ]
    },
    {
        path: '**',
        component: NotFoundComponent
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
export { routes };