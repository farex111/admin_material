import {AbstractControl, ValidationErrors} from '@angular/forms';

export class PasswordMatchValidator {
  static passwordsMatching(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;

    return password === passwordConfirm && password !== null && passwordConfirm !== null ? null : {passwordsNotMatching: true};

  }
}
