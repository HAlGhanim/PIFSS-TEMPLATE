import { Component, input, computed, contentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl } from '@angular/forms';

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
    return !!(ctrl?.invalid && (ctrl?.dirty || ctrl?.touched));
  });

  computedErrorMessage = computed(() => {
    const ctrl = this.control();
    if (!ctrl?.errors) return '';

    const errors = ctrl.errors;

    if (errors['required']) return 'هذا الحقل مطلوب';
    if (errors['email']) return 'يرجى إدخال بريد إلكتروني صحيح';
    if (errors['minlength']) {
      return `الحد الأدنى ${errors['minlength'].requiredLength} أحرف`;
    }
    if (errors['maxlength']) {
      return `الحد الأقصى ${errors['maxlength'].requiredLength} أحرف`;
    }
    if (errors['pattern']) return 'يرجى إدخال قيمة صحيحة';
    if (errors['min']) return `القيمة يجب أن تكون أكبر من ${errors['min'].min}`;
    if (errors['max']) return `القيمة يجب أن تكون أقل من ${errors['max'].max}`;

    if (errors['maxDate']) {
      return (
        errors['maxDate'].message ||
        `التاريخ يجب أن يكون قبل ${errors['maxDate'].max}`
      );
    }
    if (errors['minDate']) {
      return (
        errors['minDate'].message ||
        `التاريخ يجب أن يكون بعد ${errors['minDate'].min}`
      );
    }

    if (errors['dateRange']) {
      return 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
    }

    return this.errorMessage() || 'قيمة غير صحيحة';
  });
}
