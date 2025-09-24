import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  // Validate Kuwait Civil ID (12 digits)
  static kuwaitCivilId(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const civilIdRegex = /^[123]\d{11}$/;
      return civilIdRegex.test(value) ? null : { kuwaitCivilId: true };
    };
  }

  // Date range validator
  static dateRange(startDateField: string, endDateField: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const startDate = formGroup.get(startDateField)?.value;
      const endDate = formGroup.get(endDateField)?.value;

      // If either date is empty, skip validation (let required handle it)
      if (!startDate || !endDate) return null;

      const start = new Date(startDate);
      const end = new Date(endDate);

      // Check if dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return null;
      }

      // Set error on the form group if end date is before start date
      if (start > end) {
        return { dateRange: true };
      }

      return null;
    };
  }

  // Future date validator
  static futureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return inputDate > today ? null : { futureDate: true };
    };
  }

  // Past date validator
  static pastDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return inputDate < today ? null : { pastDate: true };
    };
  }

  // Arabic text validator
  static arabicText(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const arabicRegex = /^[\u0600-\u06FF\s]+$/;
      return arabicRegex.test(value) ? null : { arabicText: true };
    };
  }

  // English text validator
  static englishText(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const englishRegex = /^[a-zA-Z\s]+$/;
      return englishRegex.test(value) ? null : { englishText: true };
    };
  }

  // Positive number validator
  static positiveNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') return null;

      return Number(value) > 0 ? null : { positiveNumber: true };
    };
  }

  // Kuwait Dinar validator (positive number, whole or exactly 3 decimal places)
  static kuwaitDinar(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') return null;

      // Convert to string to check format
      const strValue = value.toString();

      // Regex for Kuwait Dinar: positive whole number OR number with exactly 3 decimal places
      // Valid: 100, 100.000, 100.123, 0.500
      // Invalid: 100.0, 100.00, 100.1, 100.12
      const dinarRegex = /^(?!0+(?:\.0+)?$)(\d+|\d+\.\d{3})$/;

      // Check if it matches the format
      if (!dinarRegex.test(strValue)) {
        return { kuwaitDinar: true };
      }

      // Check if the number is greater than 0
      const numValue = Number(value);
      if (numValue <= 0) {
        return { kuwaitDinar: true };
      }

      return null;
    };
  }

  // Kuwait phone number validator
  static KuwaitPhoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') return null;

      const phoneRegex = /^[0-9]{8}$/;
      return phoneRegex.test(value) ? null : { KuwaitPhoneNumber: true };
    };
  }

  // File type validator
  static fileType(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (!file) return null;

      const fileName = file.name || file;
      const extension = fileName.split('.').pop()?.toLowerCase();

      return allowedTypes.includes(extension)
        ? null
        : { fileType: { allowedTypes, actualType: extension } };
    };
  }

  // File size validator (in MB)
  static fileSize(maxSizeMB: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (!file || !file.size) return null;

      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      return file.size <= maxSizeBytes
        ? null
        : {
            fileSize: {
              maxSize: maxSizeMB,
              actualSize: (file.size / 1024 / 1024).toFixed(2),
            },
          };
    };
  }
}

export const VALIDATION_MESSAGES = {
  required: 'هذا الحقل مطلوب',
  email: 'يرجى إدخال بريد إلكتروني صحيح',
  minlength: 'الحد الأدنى للأحرف هو {requiredLength}',
  maxlength: 'الحد الأقصى للأحرف هو {requiredLength}',
  min: 'القيمة يجب أن تكون أكبر من أو تساوي {min}',
  max: 'القيمة يجب أن تكون أقل من أو تساوي {max}',
  pattern: 'يرجى إدخال رقم هاتف صحيح (8 أرقام)',
  kuwaitCivilId:
    'يرجى إدخال رقم مدني كويتي صحيح (12 رقمًا يبدأ بـ 1 أو 2 أو 3)',
  KuwaitPhoneNumber: 'يرجى إدخال رقم هاتف كويتي صحيح (8 أرقام)',
  kuwaitDinar:
    'يرجى إدخال مبلغ صحيح بالدينار الكويتي (رقم صحيح أو رقم بثلاث خانات عشرية فقط)',
  gccRegistrationNumber: 'يرجى إدخال رقم تسجيل صحيح (7 أرقام)',
  dateRange: 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية',
  futureDate: 'يجب أن يكون التاريخ في المستقبل',
  pastDate: 'يجب أن يكون التاريخ في الماضي',
  maxDate: 'التاريخ يجب أن يكون قبل أو يساوي {max}',
  minDate: 'التاريخ يجب أن يكون بعد أو يساوي {min}',
  arabicText: 'يرجى إدخال نص باللغة العربية فقط',
  englishText: 'يرجى إدخال نص باللغة الإنجليزية فقط',
  positiveNumber: 'يجب أن تكون القيمة رقم موجب',
  fileType: 'نوع الملف غير مسموح. الأنواع المسموحة: {allowedTypes}',
  fileSize: 'حجم الملف كبير جداً. الحد الأقصى: {maxSize} ميجابايت',
};

export class FormHelpers {
  // Get error message for a form control
  static getErrorMessage(
    control: AbstractControl | null,
    fieldName: string
  ): string {
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;
    const errorKey = Object.keys(errors)[0];
    const errorValue = errors[errorKey];

    let message =
      VALIDATION_MESSAGES[errorKey as keyof typeof VALIDATION_MESSAGES] ||
      'قيمة غير صحيحة';

    // Replace placeholders with actual values
    if (typeof errorValue === 'object') {
      Object.keys(errorValue).forEach((key) => {
        message = message.replace(`{${key}}`, errorValue[key]);
      });
    }

    return message;
  }

  // Mark all form controls as touched
  static markFormGroupTouched(formGroup: AbstractControl): void {
    Object.keys(formGroup.value).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof AbstractControl && control.value) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Reset form with initial values
  static resetForm(formGroup: AbstractControl, initialValues: any = {}): void {
    formGroup.reset(initialValues);
    formGroup.markAsUntouched();
    formGroup.markAsPristine();
  }

  // Check if form has specific error
  static hasError(
    control: AbstractControl | null,
    errorName?: string
  ): boolean {
    if (!control) return false;

    // If no specific error name provided, check if control is invalid and touched
    if (!errorName) {
      return !!(control.invalid && control.touched);
    }

    // Check for specific error
    return !!(control.hasError(errorName) && control.touched);
  }
}

// Usage Example:
/*
import { CustomValidators, FormHelpers } from '@/utils/validators';

// In component:
createForm() {
  return this.fb.group({
    civilId: ['', [Validators.required, CustomValidators.kuwaitCivilId()]],
    registrationNumber: ['', [Validators.required, CustomValidators.gccRegistrationNumber()]],
    email: ['', [Validators.required, Validators.email]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    amount: ['', [Validators.required, CustomValidators.positiveNumber()]],
  }, {
    validators: CustomValidators.dateRange('startDate', 'endDate')
  });
}

// Get error message
getError(fieldName: string): string {
  return FormHelpers.getErrorMessage(this.form.get(fieldName), fieldName);
}

// In template:
<app-form-field 
  label="الرقم المدني" 
  [required]="true"
  [showError]="form.get('civilId')?.invalid && form.get('civilId')?.touched"
  [errorMessage]="getError('civilId')"
>
  <input type="text" formControlName="civilId" class="form-input" />
</app-form-field>
*/
