import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';



import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { TokenInterceptor } from '../Interceptor/token.interceptor';
import { SettingsComponent } from './settings/settings.component';
import { TokenService } from '../services/TokenServices';
import { LayoutComponent } from './layout/layout.component';
import { NavComponent } from './nav/nav.component';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { ForgotPasswordComponent } from './Forgot-password/Forgot-password.component';
import { ResetPasswordComponent } from './Reset-password/Reset-password.component';
import { AuthService } from '../services/AuthServices.services';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent,
    NavComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    JwtModule.forRoot({
      config: {
        // tokenGetter: getToken,
        // allowedDomains: ["example.com"],
        // disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),

  ],
  providers: [
    TokenService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
