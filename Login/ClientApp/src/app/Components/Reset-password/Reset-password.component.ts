import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServices } from '../../services/userServices'; // Assuming correct import path

import { Router, ActivatedRoute } from '@angular/router';
import { MyValidators } from '../../Utils/Validatoes';

@Component({
    selector: 'app-reset-password',
    templateUrl: './Reset-password.component.html',
    styleUrls: ['./Reset-password.component.css']
})
export class ResetPasswordComponent {

    FormPasswordReset!: FormGroup;
    tokenUrl: string | null = null;
    emailUrl: string | null = null;

    constructor(
        private userServices: UserServices,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute // Inject ActivatedRoute for URL parameter access
    ) {
        this.route.queryParams.subscribe(params => {
            this.tokenUrl = params['Token']; // Using correct casing 'Token'
            this.emailUrl = params['email'];
            // Call the builderFormPasswordReset function after capturing parameters:
            this.builderFormPasswordReset();
        });
    }

    private builderFormPasswordReset() {
        this.FormPasswordReset = this.fb.group({
            token: [this.tokenUrl, [Validators.required]],
            email: [this.emailUrl, [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8), MyValidators.validPassword]],
            confirmPassword: ['', [Validators.required, Validators.minLength(8), MyValidators.validPassword]],
        }, {
            validators: MyValidators.matchPasswords
        });
    }

    onSutmit() {
        if (this.FormPasswordReset.valid) {

            const { confirmPassword, ...userData } = this.FormPasswordReset.value;

            this.userServices.ResetPassword(userData!).subscribe(
                response => {
                    // Manejar la respuesta del backend
                    console.log('Respuesta del backend:', response);
                },
                error => {
                    // Manejar cualquier error en la solicitud HTTP
                    console.error('Error al enviar el formulario de registro al backend:', error);
                })
        } else {
            if (!this.FormPasswordReset.get("password")?.valid) {
                alert("La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.");
            } else if (!this.FormPasswordReset.get("email")?.valid) {
                alert("El email debe ser válido.");
            } else {
                alert("Por favor, rellene correctamente todos los campos.");
            }
        }
    }

    get passwordField() {
        return this.FormPasswordReset.get('password')!;
    }

    get confirmPasswordField() {
        return this.FormPasswordReset.get('confirmPassword')!;
    }

    get emailField() {
        return this.FormPasswordReset.get('email')!;
    }

    get TokenField() {
        return this.FormPasswordReset.get('token')!;
    }

}
