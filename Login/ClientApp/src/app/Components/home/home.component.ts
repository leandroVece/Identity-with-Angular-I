import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tokens } from '../..//Models/Token.models';
import { UserLogin, UserRegister } from 'src/app/Models/User.Models';
import { MyValidators } from '../../Utils/Validatoes';

import { Router } from '@angular/router';
import { UserServices } from '../../services/userServices';


declare var bootstrap: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent {

    formLogin!: FormGroup;
    formRegister!: FormGroup;

    userLogin: UserLogin | null = null;
    userRegister: UserRegister | null = null;

    responseTokens!: Tokens;

    constructor(private userServices: UserServices, private fb: FormBuilder, private router: Router) {
        this.builderLoginForm();
        this.builderRegisterForm();
    }

    private builderLoginForm() {
        this.formLogin = this.fb.group({
            userName: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8), MyValidators.validPassword]],
        })
    }

    private builderRegisterForm() {
        this.formRegister = this.fb.group({
            userName: ['', [Validators.required]],
            email: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8), MyValidators.validPassword]],
            confirmPassword: ['', [Validators.required, Validators.minLength(8), MyValidators.validPassword]],
            roles: [['User']]
        }, {
            validators: MyValidators.matchPasswords
        });
    }

    ngAfterViewInit() {
        const triggerTabList = Array.from(document.querySelectorAll('#ex1 a'));
        triggerTabList.forEach(function (triggerEl) {
            const tabTrigger = new bootstrap.Tab(triggerEl);

            triggerEl.addEventListener('click', function (event) {
                event.preventDefault();
                tabTrigger.show();
            });
        });
    }

    onLogin() {
        if (this.formLogin.valid) {
            this.userLogin = this.formLogin.value;
            //console.log(this.formLogin.value);
            this.userServices.Login(this.userLogin!).subscribe(
                res => {
                    // Manejar la respuesta del backend
                    console.log('Respuesta del backend:', res);
                    // console.log('Respuesta del backend:', res.response?.TokenAcces.Token);

                })
        } else {
            if (!this.userNameFieldLogin?.valid && this.passwordFieldLogin?.valid) {
                alert("El usuario debe estar cargado");
            }
            if (this.userNameFieldLogin?.valid && !this.passwordFieldLogin?.valid) {
                alert("La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial");
            }
            alert("Los campos deben rellenarse correctamente");
        }
    }

    onRegister() {
        if (this.formRegister.valid) {
            console.log(this.formRegister.value)
            const { confirmPassword, ...userData } = this.formRegister.value;
            this.userRegister = userData;

            this.userServices.Register(this.userRegister!).subscribe(
                response => {
                    // Manejar la respuesta del backend
                    console.log('Respuesta del backend:', response);
                },
                error => {
                    // Manejar cualquier error en la solicitud HTTP
                    console.error('Error al enviar el formulario de registro al backend:', error);
                    console.log(error);

                })
        } else {
            if (!this.formLogin.get("userName")?.valid) {
                alert("El nombre de usuario debe ser válido.");
            } else if (!this.formLogin.get("password")?.valid) {
                alert("La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.");
            } else if (!this.formLogin.get("email")?.valid) {
                alert("El email debe ser válido.");
            } else {
                alert("Por favor, rellene correctamente todos los campos.");
            }
        }
    }

    navigateTo() {
        this.router.navigate(['forgot-password']);
    }


    get passwordField() {
        return this.formRegister.get('password')!;
    }

    get confirmPasswordField() {
        return this.formRegister.get('confirmPassword')!;
    }

    get emailField() {
        return this.formRegister.get('email')!;
    }

    get userNameField() {
        return this.formRegister.get('userName')!;
    }


    get userNameFieldLogin() {
        return this.formLogin.get('userName')!;
    }
    get passwordFieldLogin() {
        return this.formLogin.get('password')!;
    }

}
