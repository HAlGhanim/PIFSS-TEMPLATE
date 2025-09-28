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
  customClass = input<string>(''); // New input for custom classes
  variant = input<
    'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'custom'
  >('primary'); // New variant input

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

  getButtonClasses(): string {
    // Base classes that are always applied
    const baseClasses =
      'inline-flex items-center px-6 py-3 border text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200';

    // If custom class is provided and variant is 'custom', use only custom classes
    if (this.variant() === 'custom' && this.customClass()) {
      return `${baseClasses} ${this.customClass()}`;
    }

    // Variant-based classes
    let variantClasses = '';
    switch (this.variant()) {
      case 'primary':
        variantClasses =
          'border-transparent text-white bg-primary hover:bg-primary/90 focus:ring-primary';
        break;
      case 'secondary':
        variantClasses =
          'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary';
        break;
      case 'danger':
        variantClasses =
          'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500';
        break;
      case 'success':
        variantClasses =
          'border-transparent text-white bg-green-600 hover:bg-green-700 focus:ring-green-500';
        break;
      case 'warning':
        variantClasses =
          'border-transparent text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400';
        break;
    }

    // Combine base, variant, and any additional custom classes
    return `${baseClasses} ${variantClasses} ${this.customClass()}`.trim();
  }
}
