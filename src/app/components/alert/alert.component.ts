import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./alert.component.html`,
})
export class AlertComponent {
  show = input(false);
  type = input<'success' | 'error'>('success');
  message = input('');

  alertClasses = computed(() => ({
    'bg-green-50 border-green-200 text-green-800': this.type() === 'success',
    'bg-red-50 border-red-200 text-red-800': this.type() === 'error',
  }));
}
