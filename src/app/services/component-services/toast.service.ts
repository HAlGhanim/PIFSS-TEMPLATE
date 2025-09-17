import { Injectable, signal } from '@angular/core';
import { ToastMessage, ToastType } from '../../interfaces/';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastIdCounter = 0;
  toastSignal = signal<ToastMessage[]>([]);

  showToast(message: string, type: ToastType, duration: number = 3000): void {
    const id = ++this.toastIdCounter;
    const toast: ToastMessage = { id, message, type };

    this.toastSignal.update((toasts) => [...toasts, toast]);

    setTimeout(() => {
      this.removeToast(id);
    }, duration);
  }

  showSuccess(message: string, duration?: number): void {
    this.showToast(message, ToastType.success, duration);
  }

  showError(message: string, duration?: number): void {
    this.showToast(message, ToastType.error, duration);
  }

  private removeToast(id: number): void {
    this.toastSignal.update((toasts) =>
      toasts.filter((toast) => toast.id !== id)
    );
  }

  clearAll(): void {
    this.toastSignal.set([]);
  }
}
