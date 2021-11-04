import {AbstractControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

export const requiredValidator = (control: AbstractControl): ValidationErrors | null => {
  if (Validators.required(control) === null) {
    return null;
  } else {
    return {required: $localize`This field is required`};
  }
};
