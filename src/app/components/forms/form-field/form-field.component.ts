import { CommonModule } from '@angular/common';
import { Component, computed, contentChild, input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormHelpers, ErrorMessageUtils } from '../../../utils';

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
    // Use provided error message if available
    if (this.errorMessage()) {
      return this.errorMessage();
    }

    // Use centralized error message utility
    const ctrl = this.control();
    return ErrorMessageUtils.getErrorMessage(ctrl?.control ?? null);
  });
}
