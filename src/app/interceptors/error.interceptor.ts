import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { extractValidationErrors } from '../utils';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);

  const silentErrors = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/check',
  ];

  if (silentErrors.some((url) => req.url.includes(url))) {
    return next(req).pipe(catchError((err) => throwError(() => err)));
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(`HTTP Error ${error.status}:`, error);

      let errorMessage = 'حدث خطأ غير متوقع';

      switch (error.status) {
        case 0:
          errorMessage =
            'لا يمكن الاتصال بالسيرفر. يرجى التحقق من اتصالك بالإنترنت';
          break;

        case 400:
          if (error.error?.details) {
            errorMessage = extractValidationErrors(error.error.details);
          } else {
            errorMessage =
              error.error?.arMessage ||
              error.error?.message ||
              'البيانات المدخلة غير صحيحة';
          }
          break;

        case 401:
          errorMessage = 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى';
          router.navigate(['/login'], {
            queryParams: { returnUrl: router.url },
          });
          break;

        case 403:
          errorMessage = 'ليس لديك صلاحية للوصول إلى هذا المحتوى';
          break;

        case 404:
          errorMessage = 'المورد المطلوب غير موجود';
          break;

        case 409:
          errorMessage = error.error?.arMessage || 'يوجد تعارض في البيانات';
          break;

        case 422:
          errorMessage =
            error.error?.arMessage ||
            error.error?.message ||
            'لا يمكن معالجة الطلب';
          break;

        case 429:
          errorMessage = 'تم تجاوز عدد المحاولات المسموح. يرجى المحاولة لاحقاً';
          break;

        case 500:
          errorMessage = 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً';
          break;

        case 502:
        case 503:
        case 504:
          errorMessage = 'الخدمة غير متاحة حالياً. يرجى المحاولة لاحقاً';
          break;

        default:
          if (error.error?.arMessage) {
            errorMessage = error.error.arMessage;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
      }

      snackBar.open(errorMessage, 'إغلاق', {
        duration: error.status === 401 ? 10000 : 5000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
        direction: 'rtl',
      });

      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        originalError: error,
      }));
    })
  );
};
