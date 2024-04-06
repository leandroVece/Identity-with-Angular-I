import { AbstractControl } from '@angular/forms';

export class MyValidators {


    static validPassword(control: AbstractControl) {
        const value = control.value;
        if (!containsNumber(value)) {
            return { invalid_password: true };
        }
        if (!containsSpecialCharacter(value)) {
            return { invalid_password: true };
        }
        if (!containsUppercase(value)) {
            return { invalid_password: true };
        }

        return null;
    }

    static matchPasswords(control: AbstractControl) {
        const password = control.get('password')!.value;
        const confirmPassword = control.get('confirmPassword')!.value;
        if (password !== confirmPassword) {
            return { match_password: true };
        }
        return null;
    }

}

function containsNumber(value: string) {
    return /\d/.test(value); // Comprueba si hay al menos un dígito
}

function containsSpecialCharacter(value: string) {
    return /[!@#$%^&*(),.?":{}|<>]/.test(value); // Comprueba si hay al menos un carácter especial
}

function containsUppercase(value: string) {
    return /[A-Z]/.test(value); // Comprueba si hay al menos una letra mayúscula
}
