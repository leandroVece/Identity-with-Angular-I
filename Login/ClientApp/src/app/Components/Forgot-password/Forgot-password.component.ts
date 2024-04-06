import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServices } from 'src/app/services/userServices';


@Component({
    selector: 'app-Forgot-password',
    templateUrl: './Forgot-password.component.html',
    styleUrls: ['./Forgot-password.component.css']
})

export class ForgotPasswordComponent {


    FormPasswordReset!: FormGroup;

    constructor(private userServices: UserServices,
        private fb: FormBuilder, private router: Router,) {
        this.builderFormPasswordReset();
    }

    onSutmit() {
        if (this.FormPasswordReset.value) {
            this.userServices.ForgotPassword(this.FormPasswordReset.value).subscribe(
                response => {
                    // Manejar la respuesta del backend
                    console.log('Respuesta del backend:', response);
                },
                error => {
                    // Manejar cualquier error en la solicitud HTTP
                    console.error('Error al enviar el formulario de registro al backend:', error);
                })
        } else {
            alert("Falta cargar el Email")
        }

    }


    private builderFormPasswordReset() {
        this.FormPasswordReset = this.fb.group({
            email: ['', [Validators.required]],
        });
    }


    get emailField() {
        return this.FormPasswordReset.get('email')!;
    }
}
