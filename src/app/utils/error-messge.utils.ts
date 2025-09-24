import { AbstractControl } from '@angular/forms';
import { VALIDATION_MESSAGES } from './validators.utils';

export class ErrorMessageUtils {
  /**
   * Get error message for a form control
   * This is the single source of truth for error message formatting
   */
  static getErrorMessage(
    control: AbstractControl | null,
    fieldName?: string
  ): string {
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;
    const errorKey = Object.keys(errors)[0];
    const errorValue = errors[errorKey];

    // Get the base message from validation messages
    let message =
      VALIDATION_MESSAGES[errorKey as keyof typeof VALIDATION_MESSAGES] ||
      'قيمة غير صحيحة';

    // Replace placeholders with actual values
    if (typeof errorValue === 'object' && errorValue !== null) {
      Object.keys(errorValue).forEach((key) => {
        const value = errorValue[key];
        if (value !== null && value !== undefined) {
          message = message.replace(`{${key}}`, value.toString());
        }
      });
    }

    return message;
  }

  /**
   * Get error message for a specific field in a form
   * Useful for form-level errors like dateRange
   */
  static getFormFieldError(
    form: AbstractControl | null,
    fieldName: string,
    formErrors?: string[]
  ): string {
    if (!form) return '';

    // Check for field-specific errors first
    const fieldControl = form.get(fieldName);
    if (fieldControl && fieldControl.errors && fieldControl.touched) {
      return this.getErrorMessage(fieldControl, fieldName);
    }

    // Check for form-level errors that affect this field
    if (formErrors && form.errors) {
      for (const errorKey of formErrors) {
        if (form.errors[errorKey] && fieldControl?.touched) {
          return (
            VALIDATION_MESSAGES[errorKey as keyof typeof VALIDATION_MESSAGES] ||
            ''
          );
        }
      }
    }

    return '';
  }

  /**
   * Check if a control has an error
   */
  static hasError(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Check if a specific field has error including form-level errors
   */
  static fieldHasError(
    form: AbstractControl | null,
    fieldName: string,
    formErrors?: string[]
  ): boolean {
    if (!form) return false;

    const fieldControl = form.get(fieldName);

    // Check field-level errors
    if (this.hasError(fieldControl)) {
      return true;
    }

    // Check form-level errors that affect this field
    if (formErrors && form.errors && fieldControl?.touched) {
      return formErrors.some((errorKey) => form.errors![errorKey]);
    }

    return false;
  }

  /**
   * Get all errors for a form as an array of messages
   * Useful for debugging or displaying all errors at once
   */
  static getAllFormErrors(form: AbstractControl): string[] {
    const errors: string[] = [];

    // Get field-level errors
    Object.keys(form.value).forEach((key) => {
      const control = form.get(key);
      if (control && control.errors && control.touched) {
        const message = this.getErrorMessage(control, key);
        if (message) {
          errors.push(`${key}: ${message}`);
        }
      }
    });

    // Get form-level errors
    if (form.errors) {
      Object.keys(form.errors).forEach((errorKey) => {
        const message =
          VALIDATION_MESSAGES[errorKey as keyof typeof VALIDATION_MESSAGES];
        if (message) {
          errors.push(message);
        }
      });
    }

    return errors;
  }
}
