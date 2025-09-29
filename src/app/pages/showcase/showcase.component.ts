import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ButtonComponent,
  CardComponent,
  ContainerComponent,
  DatePicker,
  FormFieldComponent,
  FormInputComponent,
  FormSelectGroupComponent,
  PageHeaderComponent,
} from '../../components';
import { DateService, ToastService } from '../../services';
import { CustomValidators, ErrorMessageUtils, FormHelpers } from '../../utils';
import { GCC_COUNTRIES, SelectOptionGroup, GCCCountry } from '../../interfaces';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  private sanitizer = inject(DomSanitizer);

  isSubmitting = signal(false);
  isDownloading = signal(false);
  selectedCountry = signal('KW'); // Default to Kuwait
  showCountryDropdown = signal(false);

  // Using DateService instead of DateUtils directly
  today = this.dateService.getToday();

  // Get all GCC countries for custom dropdown
  gccCountriesList = GCC_COUNTRIES;

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
      phoneCountry: ['KW', Validators.required], // Country selection for phone (hidden field)
      phone: ['', [Validators.required, CustomValidators.gccPhoneNumber('KW')]], // GCC phone with dynamic country
      notes: [''],
    },
    {
      validators: CustomValidators.dateRange('startDate', 'endDate'),
    }
  );

  constructor() {
    // Listen to country changes to update phone validation
    this.form.get('phoneCountry')?.valueChanges.subscribe((country) => {
      if (country) {
        this.selectedCountry.set(country);
        const phoneControl = this.form.get('phone');

        // Update validators with new country
        phoneControl?.setValidators([
          Validators.required,
          CustomValidators.gccPhoneNumber(country),
        ]);

        // Revalidate
        phoneControl?.updateValueAndValidity();
      }
    });
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdownContainer = target.closest('.phone-country-selector');
    if (!dropdownContainer) {
      this.showCountryDropdown.set(false);
    }
  }

  // Get the current selected country data
  getSelectedCountryData(): GCCCountry | undefined {
    return GCC_COUNTRIES.find((c) => c.code === this.selectedCountry());
  }

  // Select country from custom dropdown
  selectCountry(countryCode: string) {
    this.form.get('phoneCountry')?.setValue(countryCode);
    this.showCountryDropdown.set(false);
  }

  // Toggle country dropdown
  toggleCountryDropdown() {
    this.showCountryDropdown.update((v) => !v);
  }

  // Get phone placeholder based on selected country
  getPhonePlaceholder(): string {
    const country = this.getSelectedCountryData();
    return country ? country.phoneExample : '99999999';
  }

  // Combined phone hint for the unified field
  getCombinedPhoneHint(): string {
    const country = this.getSelectedCountryData();
    if (country) {
      if (country.code === 'AE') {
        return `أدخل رقم الهاتف (7-9 أرقام) - مثال: ${country.phoneExample}`;
      }
      return `أدخل رقم الهاتف (${country.phoneLength} أرقام) - مثال: ${country.phoneExample}`;
    }
    return 'اختر الدولة ثم أدخل رقم الهاتف';
  }

  // Combined error message for phone and country
  getCombinedPhoneErrorMessage(): string {
    // Check country error first
    const countryControl = this.form.get('phoneCountry');
    if (countryControl?.invalid && countryControl?.touched) {
      if (countryControl.errors?.['required']) {
        return 'يجب اختيار الدولة';
      }
    }

    // Then check phone error
    const phoneControl = this.form.get('phone');
    if (phoneControl?.invalid && phoneControl?.touched) {
      if (phoneControl.errors?.['required']) {
        return 'رقم الهاتف مطلوب';
      }
      if (phoneControl.errors?.['gccPhoneNumber']) {
        const country = this.getSelectedCountryData();
        if (country?.code === 'AE') {
          return `رقم هاتف ${country.arabicName} يجب أن يحتوي على 7-9 أرقام`;
        }
        return `رقم هاتف ${
          country?.arabicName || 'غير صحيح'
        } يجب أن يحتوي على ${country?.phoneLength || ''} أرقام`;
      }
    }

    return '';
  }

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

      // Format phone number with country code
      const country = this.getSelectedCountryData();
      const phoneNumber = this.form.value.phone;
      const formattedPhone =
        country && phoneNumber
          ? `${country.phoneCode} ${phoneNumber}`
          : phoneNumber;

      // Convert dates using DateService before sending to API
      const formData = {
        ...this.form.value,
        phone: formattedPhone,
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
      phoneCountry: 'KW', // Reset to Kuwait
      phone: '',
      notes: '',
    };

    FormHelpers.resetForm(this.form, initialValues);
    this.selectedCountry.set('KW');
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
