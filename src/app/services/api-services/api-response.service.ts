import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { ToastService } from '../component-services/toast.service';

export interface ApiResponseOptions {
  successMessage?: string;
  errorMessage?: string;
  showSuccess?: boolean;
  showError?: boolean;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  onComplete?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ApiResponseService {
  private toastService = inject(ToastService);

  /**
   * Handle successful API response with toast
   */
  handleSuccess(message: string, callback?: () => void): void {
    this.toastService.showSuccess(message);
    callback?.();
  }

  /**
   * Handle error response with toast
   */
  handleError(error: any, customMessage?: string): void {
    const message = customMessage || this.extractErrorMessage(error);
    this.toastService.showError(message);
  }

  /**
   * Extract error message from various error formats
   */
  private extractErrorMessage(error: any): string {
    // Check for API error message
    if (error?.error?.arMessage) {
      return error.error.arMessage;
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.message) {
      return error.message;
    }

    // Default messages based on status
    switch (error?.status) {
      case 400:
        return 'البيانات المدخلة غير صحيحة';
      case 401:
        return 'غير مصرح لك بالدخول';
      case 403:
        return 'ليس لديك صلاحية لهذا الإجراء';
      case 404:
        return 'المورد المطلوب غير موجود';
      case 500:
        return 'حدث خطأ في الخادم';
      default:
        return 'حدث خطأ غير متوقع';
    }
  }

  /**
   * Wrap an Observable with automatic success/error toast handling
   */
  wrapWithToast<T>(
    observable: Observable<T>,
    options: ApiResponseOptions = {}
  ): Observable<T> {
    const {
      successMessage,
      errorMessage,
      showSuccess = true,
      showError = true,
      onSuccess,
      onError,
      onComplete,
    } = options;

    return observable.pipe(
      tap((response) => {
        if (showSuccess && successMessage) {
          this.handleSuccess(successMessage, onSuccess);
        } else {
          onSuccess?.();
        }
      }),
      catchError((error) => {
        if (showError) {
          this.handleError(error, errorMessage);
        }
        onError?.(error);
        return throwError(() => error);
      }),
      finalize(() => {
        onComplete?.();
      })
    );
  }

  /**
   * Common success messages
   */
  showCreateSuccess(itemName: string = 'العنصر'): void {
    this.toastService.showSuccess(`تم إنشاء ${itemName} بنجاح`);
  }

  showUpdateSuccess(itemName: string = 'العنصر'): void {
    this.toastService.showSuccess(`تم تحديث ${itemName} بنجاح`);
  }

  showDeleteSuccess(itemName: string = 'العنصر'): void {
    this.toastService.showSuccess(`تم حذف ${itemName} بنجاح`);
  }

  showSaveSuccess(): void {
    this.toastService.showSuccess('تم الحفظ بنجاح');
  }

  showLoadSuccess(): void {
    this.toastService.showSuccess('تم تحميل البيانات بنجاح');
  }

  showSubmitSuccess(): void {
    this.toastService.showSuccess('تم إرسال النموذج بنجاح');
  }

  showDownloadSuccess(fileName?: string): void {
    const message = fileName
      ? `تم تنزيل ${fileName} بنجاح`
      : 'تم التنزيل بنجاح';
    this.toastService.showSuccess(message);
  }

  showUploadSuccess(fileName?: string): void {
    const message = fileName ? `تم رفع ${fileName} بنجاح` : 'تم الرفع بنجاح';
    this.toastService.showSuccess(message);
  }

  showRefreshSuccess(): void {
    this.toastService.showSuccess('تم تحديث البيانات');
  }

  showImportSuccess(count?: number): void {
    const message = count
      ? `تم استيراد ${count} عنصر بنجاح`
      : 'تم الاستيراد بنجاح';
    this.toastService.showSuccess(message);
  }

  showExportSuccess(count?: number): void {
    const message = count ? `تم تصدير ${count} عنصر بنجاح` : 'تم التصدير بنجاح';
    this.toastService.showSuccess(message);
  }

  /**
   * Common error messages
   */
  showValidationError(fieldName?: string): void {
    const message = fieldName
      ? `يرجى التحقق من ${fieldName}`
      : 'يرجى تصحيح الأخطاء في النموذج';
    this.toastService.showError(message);
  }

  showRequiredFieldsError(): void {
    this.toastService.showError('يرجى ملء جميع الحقول المطلوبة');
  }

  showNetworkError(): void {
    this.toastService.showError(
      'خطأ في الاتصال بالشبكة. يرجى المحاولة مرة أخرى'
    );
  }

  showPermissionError(): void {
    this.toastService.showError('ليس لديك صلاحية لهذا الإجراء');
  }

  showNotFoundError(itemName: string = 'العنصر'): void {
    this.toastService.showError(`${itemName} غير موجود`);
  }

  showDuplicateError(itemName: string = 'العنصر'): void {
    this.toastService.showError(`${itemName} موجود مسبقاً`);
  }

  showFileSizeError(maxSize: number): void {
    this.toastService.showError(
      `حجم الملف يجب أن لا يتجاوز ${maxSize} ميجابايت`
    );
  }

  showFileTypeError(allowedTypes: string[]): void {
    this.toastService.showError(
      `نوع الملف غير مسموح. الأنواع المسموحة: ${allowedTypes.join(', ')}`
    );
  }

  showDateRangeError(): void {
    this.toastService.showError('الفترة الزمنية غير صحيحة');
  }

  showMaxLimitError(limit: number, itemName: string = 'العناصر'): void {
    this.toastService.showError(`الحد الأقصى لعدد ${itemName} هو ${limit}`);
  }

  /**
   * Common warning messages
   */
  showWarning(message: string): void {
    // You could extend ToastService to support warning type
    // For now, we'll use error with a warning prefix
    this.toastService.showError(`تحذير: ${message}`);
  }

  showSessionExpiring(minutes: number = 5): void {
    this.showWarning(`ستنتهي الجلسة خلال ${minutes} دقائق`);
  }

  showUnsavedChanges(): void {
    this.showWarning('لديك تغييرات غير محفوظة');
  }

  /**
   * Common info messages
   */
  showInfo(message: string): void {
    // You could extend ToastService to support info type
    // For now, we'll use success for info messages
    this.toastService.showSuccess(message);
  }

  showProcessing(processName: string = 'العملية'): void {
    this.showInfo(`جاري معالجة ${processName}...`);
  }

  showPending(itemName: string = 'الطلب'): void {
    this.showInfo(`${itemName} قيد الانتظار`);
  }

  /**
   * Batch operations
   */
  showBatchSuccess(
    successCount: number,
    totalCount: number,
    operation: string = 'معالجة'
  ): void {
    if (successCount === totalCount) {
      this.toastService.showSuccess(
        `تم ${operation} جميع العناصر بنجاح (${totalCount})`
      );
    } else if (successCount > 0) {
      this.showWarning(`تم ${operation} ${successCount} من ${totalCount} عنصر`);
    } else {
      this.toastService.showError(`فشل ${operation} جميع العناصر`);
    }
  }

  /**
   * Confirmation messages
   */
  showActionConfirmed(action: string = 'الإجراء'): void {
    this.toastService.showSuccess(`تم تأكيد ${action}`);
  }

  showActionCancelled(action: string = 'الإجراء'): void {
    this.showInfo(`تم إلغاء ${action}`);
  }
}
