import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./button.component.html`,
})
export class ButtonComponent {
  loading = input(false);
  disabled = input(false);
  text = input('إنشاء التقرير');
  btnClick = output<void>();
  showIcon = input(true);
  iconType = input<'download' | 'upload'>('download');

  onClick() {
    if (!this.disabled() && !this.loading()) {
      this.btnClick.emit();
    }
  }
}
