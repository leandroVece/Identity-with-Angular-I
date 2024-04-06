import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


import { UserServices } from '../../services/userServices';
import { TokenService } from '../../services/TokenServices';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EMAIL_CLAIM_KEY } from 'src/app/constant';
import { UserTwoFactoryLogin } from 'src/app/Models/User.Models';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})

export class SettingsComponent {

    Form!: FormGroup;
    data!: UserTwoFactoryLogin;

    constructor(private formBuilder: FormBuilder, private userServices: UserServices,
        private TokenService: TokenService, private jwtHelper: JwtHelperService) {
        this.builderSettingsForm();
    }

    submitForm() {
        // Aquí puedes manejar el envío del formulario, como enviar los datos al servidor


        this.userServices.Settings(this.Form.value).subscribe(
            res => {
                console.log('Respuesta del backend:', res)
            });
    }

    private builderSettingsForm() {
        const token = this.TokenService.getToken();
        if (token) {
            const decoded = this.jwtHelper.decodeToken(token.tokenAcces.token);
            const email = decoded[EMAIL_CLAIM_KEY];
            this.Form = this.formBuilder.group({
                TowFactory: false, // Valor inicial del checkbox
                email: [email]
            });
        } else {
            // Manejo del caso en el que el token no está disponible
            alert('No se encontró el token de acceso o el token esta vencido');
        }
    }

}