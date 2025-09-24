import { Component, input, computed, contentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl } from '@angular/forms';
import { VALIDATION_MESSAGES, FormHelpers } from '../../../utils/validators';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./form-field.component.html`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class FormFieldComponent {
  label = input('');
  required = input(false);
  hint = input('');
  containerClass = input('');
  fieldId = input('');
  showError = input(false);
  errorMessage = input('');

  control = contentChild(NgControl);

  hasError = computed(() => {
    const ctrl = this.control();
    return FormHelpers.hasError(ctrl?.control ?? null);
  });

  computedErrorMessage = computed(() => {
    if (this.errorMessage()) {
      return this.errorMessage();
    }

    const ctrl = this.control();
    if (!ctrl?.errors) return '';

    const errors = ctrl.errors;
    const errorKey = Object.keys(errors)[0];
    const errorValue = errors[errorKey];
    let message =
      VALIDATION_MESSAGES[errorKey as keyof typeof VALIDATION_MESSAGES] ||
      'قيمة غير صحيحة';

    if (typeof errorValue === 'object' && errorValue !== null) {
      Object.keys(errorValue).forEach((key) => {
        const value = errorValue[key];
        if (value !== null && value !== undefined) {
          message = message.replace(`{${key}}`, value.toString());
        }
      });
    }

    return message;
  });
}
