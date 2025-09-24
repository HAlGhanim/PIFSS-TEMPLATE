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
import { ToastService, DateService } from '../../services';
import { CustomValidators, FormHelpers, ErrorMessageUtils } from '../../utils';

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
  private dateService = inject(DateService);

  isSubmitting = signal(false);
  isDownloading = signal(false);

  // Using DateService instead of DateUtils directly
  today = this.dateService.getToday();

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

  // Using ErrorMessageUtils for centralized error checking
  hasError(fieldName: string): boolean {
    // Special handling for endDate field with dateRange validation
    if (fieldName === 'endDate') {
      return ErrorMessageUtils.fieldHasError(this.form, fieldName, [
        'dateRange',
      ]);
    }

    return ErrorMessageUtils.hasError(this.form.get(fieldName));
  }

  // Using ErrorMessageUtils for centralized error messages
  getErrorMessage(fieldName: string): string {
    // Special handling for endDate field with dateRange validation
    if (fieldName === 'endDate') {
      return ErrorMessageUtils.getFormFieldError(this.form, fieldName, [
        'dateRange',
      ]);
    }

    return ErrorMessageUtils.getErrorMessage(
      this.form.get(fieldName),
      fieldName
    );
  }

  onSubmit() {
    console.log('Form Valid:', this.form.valid);
    console.log('Form Errors:', this.form.errors);
    console.log('Form Values:', this.form.value);

    // Log individual control errors for debugging
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      if (control?.errors) {
        console.log(`${key} errors:`, control.errors);
      }
    });

    if (this.form.valid) {
      this.isSubmitting.set(true);

      // Convert dates using DateService before sending to API
      const formData = {
        ...this.form.value,
        startDate: this.dateService.toApiFormat(this.form.value.startDate),
        endDate: this.dateService.toApiFormat(this.form.value.endDate),
      };

      // Simulate API call
      setTimeout(() => {
        console.log('Sending Form Data:', formData);

        // Format dates for display using DateService
        const dateRange = this.dateService.formatRange(
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

      // Use ErrorMessageUtils to get all errors
      const errors = ErrorMessageUtils.getAllFormErrors(this.form);

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

    // Show date validation example using DateService
    setTimeout(() => {
      const today = this.dateService.formatForDisplay(new Date(), 'ar-KW');
      this.toastService.showSuccess(`تاريخ اليوم: ${today}`);
    }, 2000);
  }

  // Additional helper method using DateService for validation
  validateDateInput(dateString: string): boolean {
    return this.dateService.isValid(dateString);
  }

  // Method to create date params for API calls using DateService
  getDateParams() {
    return this.dateService.createRangeParams(
      this.form.value.startDate,
      this.form.value.endDate,
      'StartDate',
      'EndDate'
    );
  }

  // Additional convenient date methods using DateService
  getDateRangeInfo(): string | null {
    const days = this.dateService.getDaysBetween(
      this.form.value.startDate,
      this.form.value.endDate
    );

    if (days !== null) {
      return `عدد الأيام: ${days} يوم`;
    }
    return null;
  }

  // Check if selected date range is valid for business rules
  isDateRangeValid(): boolean {
    const startDate = this.form.value.startDate;
    const endDate = this.form.value.endDate;

    if (!startDate || !endDate) return true; // Let required validator handle empty values

    // Example business rule: Date range cannot exceed 1 year
    const days = this.dateService.getDaysBetween(startDate, endDate);
    if (days && days > 365) {
      this.toastService.showError('لا يمكن أن تتجاوز الفترة سنة واحدة');
      return false;
    }

    // Example business rule: Start date cannot be in the future
    if (this.dateService.isFuture(startDate)) {
      this.toastService.showError('تاريخ البداية لا يمكن أن يكون في المستقبل');
      return false;
    }

    return true;
  }
}
