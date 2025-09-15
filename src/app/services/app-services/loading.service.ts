import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingCount = 0;
  private loadingSignal = signal(false);

  readonly isLoading = this.loadingSignal.asReadonly();

  show(): void {
    this.loadingCount++;
    this.loadingSignal.set(true);
    console.log('Loading started');
  }

  hide(): void {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.loadingSignal.set(false);
      console.log('Loading finished');
    }
  }
}
