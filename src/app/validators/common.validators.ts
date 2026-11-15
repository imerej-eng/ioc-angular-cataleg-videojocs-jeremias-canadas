import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Valida que el text no estigui format només per espais. */
export function notBlankValidator(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value !== 'string' || control.value === '') {
    return null;
  }
  return control.value.trim() === '' ? { notBlank: true } : null;
}

/** Crea un validador que exigeix un mínim de caràcters sense comptar els espais dels extrems. */
export function trimmedMinLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (typeof control.value !== 'string') {
      return null;
    }
    const trimmedLength = control.value.trim().length;
    if (trimmedLength === 0) {
      return null;
    }
    return trimmedLength < minLength ? { trimmedMinLength: true } : null;
  };
}
