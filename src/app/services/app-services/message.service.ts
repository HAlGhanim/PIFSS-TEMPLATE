import { Injectable, signal, computed } from '@angular/core';

export interface Message {
  type: 'success' | 'error';
  text: string;
  show: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messageSignal = signal<Message>({
    type: 'success',
    text: '',
    show: false,
  });

  // Expose as readonly signal
  message = this.messageSignal.asReadonly();

  // Computed signals for convenience
  isVisible = computed(() => this.messageSignal().show);
  messageText = computed(() => this.messageSignal().text);
  messageType = computed(() => this.messageSignal().type);

  showSuccess(text: string, duration = 5000) {
    this.messageSignal.set({
      type: 'success',
      text,
      show: true,
    });

    setTimeout(() => {
      this.hide();
    }, duration);
  }

  showError(text: string, duration = 5000) {
    this.messageSignal.set({
      type: 'error',
      text,
      show: true,
    });

    setTimeout(() => {
      this.hide();
    }, duration);
  }

  hide() {
    this.messageSignal.update((current) => ({
      ...current,
      show: false,
    }));
  }
}
