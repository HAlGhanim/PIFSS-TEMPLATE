import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconService } from '../../services';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./button.component.html`,
})
export class ButtonComponent {
  private iconService = inject(IconService);

  loading = input(false);
  disabled = input(false);
  text = input('إنشاء التقرير');
  btnClick = output<void>();
  showIcon = input(true);
  iconType = input<string>('download');

  onClick() {
    if (!this.disabled() && !this.loading()) {
      this.btnClick.emit();
    }
  }

  iconPath(): string {
    if (!this.iconService.hasIcon(this.iconType())) {
      console.warn(`Icon "${this.iconType()}" not found. Using default.`);
    }
    return this.iconService.getIcon(this.iconType()).path;
  }
}
