import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ButtonComponent,
  CardComponent,
  DatePicker,
  FormFieldComponent,
  FormInputComponent,
  FormSelectGroupComponent,
  PageHeaderComponent,
  ContainerComponent,
} from '../../components';
import { ToastService } from '../../services';
import {
  CustomValidators,
  FormHelpers,
  DateUtils,
  VALIDATION_MESSAGES,
} from '../../utils';

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent,
    DatePicker,
    FormFieldComponent,
    FormInputComponent,
    FormSelectGroupComponent,
    PageHeaderComponent,
    ContainerComponent,
  ],
  templateUrl: `./showcase.component.html`,
})
export class ShowcaseComponent {
  private fb = inject(FormBuilder);
  public toastService = inject(ToastService);

  isSubmitting = signal(false);
  isDownloading = signal(false);

  // Using DateUtils to get today's date in correct format
  today = DateUtils.toDateString(new Date());

  departmentGroups = [
    {
      label: 'الإدارات الرئيسية',
      options: [
        { value: 'it', label: 'تكنولوجيا المعلومات' },
        { value: 'hr', label: 'الموارد البشرية' },
        { value: 'finance', label: 'المالية' },
      ],
    },
    {
      label: 'الإدارات الفرعية',
      options: [
        { value: 'support', label: 'الدعم الفني' },
        { value: 'operations', label: 'العمليات' },
        { value: 'planning', label: 'التخطيط' },
      ],
    },
  ];

  form = this.fb.group(
    {
      civilId: ['', [Validators.required, CustomValidators.kuwaitCivilId()]],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      amount: ['', [Validators.required, CustomValidators.kuwaitDinar()]],
      phone: ['', [Validators.required, CustomValidators.KuwaitPhoneNumber()]],
      notes: [''],
    },
    {
      validators: CustomValidators.dateRange('startDate', 'endDate'),
    }
  );

  // Using FormHelpers for error checking
  hasError(fieldName: string): boolean {
    if (fieldName === 'endDate') {
      const control = this.form.get(fieldName);
      const startDateControl = this.form.get('startDate');

      if (
        this.form.errors?.['dateRange'] &&
        control?.touched &&
        startDateControl?.touched &&
        startDateControl?.value &&
        control?.value
      ) {
        return true;
      }
    }

    return FormHelpers.hasError(this.form.get(fieldName));
  }

  // Using FormHelpers for error messages
  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);

    if (
      fieldName === 'endDate' &&
      this.form.errors?.['dateRange'] &&
      control?.touched
    ) {
      return VALIDATION_MESSAGES['dateRange'];
    }

    if (!control || !control.errors || !control.touched) return '';

    return FormHelpers.getErrorMessage(control, fieldName);
  }

  onSubmit() {
    console.log('Form Valid:', this.form.valid);
    console.log('Form Errors:', this.form.errors);
    console.log('Form Values:', this.form.value);

    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      if (control?.errors) {
        console.log(`${key} errors:`, control.errors);
      }
    });

    if (this.form.valid) {
      this.isSubmitting.set(true);

      // Convert dates using DateUtils before sending to API
      const formData = {
        ...this.form.value,
        startDate: DateUtils.toOptionalDateString(this.form.value.startDate),
        endDate: DateUtils.toOptionalDateString(this.form.value.endDate),
      };

      // Simulate API call
      setTimeout(() => {
        console.log('Sending Form Data:', formData);

        // Format dates for display in success message
        const dateRange = DateUtils.formatDateRange(
          this.form.value.startDate,
          this.form.value.endDate,
          'ar-KW'
        );

        this.toastService.showSuccess(
          `تم إرسال النموذج بنجاح! الفترة: ${dateRange}`
        );
        this.isSubmitting.set(false);

        // Optionally reset the form after successful submission
        // this.onReset();
      }, 2000);
    } else {
      // Using FormHelpers to mark all fields as touched
      FormHelpers.markFormGroupTouched(this.form);

      // Show specific errors for debugging
      const errors: string[] = [];
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
        if (control?.errors) {
          errors.push(`${key}: ${this.getErrorMessage(key)}`);
        }
      });

      if (this.form.errors?.['dateRange']) {
        errors.push('تاريخ النهاية يجب أن يكون بعد تاريخ البداية');
      }

      console.log('Form validation errors:', errors);
      this.toastService.showError('يرجى تصحيح الأخطاء في النموذج');
    }
  }

  onDownload() {
    this.isDownloading.set(true);

    // Simulate download
    setTimeout(() => {
      this.toastService.showSuccess('تم تنزيل التقرير بنجاح!');
      this.isDownloading.set(false);
    }, 1500);
  }

  onReset() {
    // Using FormHelpers to properly reset the form
    const initialValues = {
      civilId: '',
      fullName: '',
      email: '',
      department: '',
      startDate: '',
      endDate: '',
      amount: '',
      phone: '',
      notes: '',
    };

    FormHelpers.resetForm(this.form, initialValues);
    this.toastService.showSuccess('تم إعادة تعيين النموذج');
  }

  showToastExamples() {
    this.toastService.showSuccess('مثال على رسالة نجاح');
    setTimeout(() => {
      this.toastService.showError('مثال على رسالة خطأ');
    }, 1000);

    // Show date validation example
    setTimeout(() => {
      const today = DateUtils.toDisplayString(new Date(), 'ar-KW');
      this.toastService.showSuccess(`تاريخ اليوم: ${today}`);
    }, 2000);
  }

  // Additional helper method to demonstrate DateUtils validation
  validateDateInput(dateString: string): boolean {
    return DateUtils.isValidDateString(dateString);
  }

  // Method to create date params for API calls
  getDateParams() {
    const params = {
      ...DateUtils.createDateParams(this.form.value.startDate, 'StartDate'),
      ...DateUtils.createDateParams(this.form.value.endDate, 'EndDate'),
    };
    return params;
  }
}
