// import { Directive } from '@angular/core';

// @Directive({
//   selector: '[appPasswordMatch]',
//   standalone: true
// })
// export class PasswordMatchDirective {

//   constructor() { }

// }
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }
  return password.value === confirmPassword.value
    ? null
    : { passwordMismatch: true };
};
