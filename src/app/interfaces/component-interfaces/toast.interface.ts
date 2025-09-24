export enum ToastType {
  success = 'SUCCESS',
  error = 'ERROR',
}

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

export interface ApiResponseOptions {
  successMessage?: string;
  errorMessage?: string;
  showSuccess?: boolean;
  showError?: boolean;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  onComplete?: () => void;
}
