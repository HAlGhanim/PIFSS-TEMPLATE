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
import { CustomValidators } from '../../utils';

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
  today = new Date().toISOString().split('T')[0];

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
      amount: ['', [Validators.required, CustomValidators.positiveNumber()]],
      phone: ['', [Validators.pattern(/^[0-9]{8}$/)]],
      notes: [''],
    },
    {
      validators: CustomValidators.dateRange('startDate', 'endDate'),
    }
  );

  hasError(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control?.errors || !control?.touched) return '';

    const errors = control.errors;
    const errorKey = Object.keys(errors)[0];

    const errorMessages: { [key: string]: string } = {
      required: 'هذا الحقل مطلوب',
      email: 'يرجى إدخال بريد إلكتروني صحيح',
      minlength: `الحد الأدنى ${errors['minlength']?.requiredLength} أحرف`,
      pattern: 'يرجى إدخال قيمة صحيحة',
      kuwaitCivilId: 'يرجى إدخال رقم مدني كويتي صحيح (12 رقم)',
      positiveNumber: 'يجب أن تكون القيمة رقم موجب',
      dateRange: 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية',
    };

    return errorMessages[errorKey] || 'قيمة غير صحيحة';
  }

  onSubmit() {
    if (this.form.valid) {
      this.isSubmitting.set(true);

      // Simulate API call
      setTimeout(() => {
        console.log('Form Data:', this.form.value);
        this.toastService.showSuccess('تم إرسال النموذج بنجاح!');
        this.isSubmitting.set(false);
      }, 2000);
    } else {
      // Mark all fields as touched to show errors
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });
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
    this.form.reset();
    this.toastService.showSuccess('تم إعادة تعيين النموذج');
  }

  showToastExamples() {
    this.toastService.showSuccess('مثال على رسالة نجاح');
    setTimeout(() => {
      this.toastService.showError('مثال على رسالة خطأ');
    }, 1000);
  }
}
