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

  // Existing inputs
  loading = input(false);
  disabled = input(false);
  text = input('إنشاء التقرير');
  btnClick = output<void>();
  showIcon = input(true);
  iconType = input<string>('download');
  customClass = input<string>('');
  variant = input<
    'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'custom'
  >('primary');

  // New inputs
  size = input<'sm' | 'md' | 'lg'>('md');
  fullWidth = input(false);
  overrideBaseClasses = input(false);
  iconPosition = input<'left' | 'right'>('left'); // New: control icon position

  hasProjectedContent = false; // Set this based on content projection detection

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
    // If overrideBaseClasses is true, only use custom classes
    if (this.overrideBaseClasses() && this.customClass()) {
      return this.customClass();
    }

    // Base classes (without size-specific padding/text)
    const baseClasses = [
      'inline-flex',
      'items-center',
      'border',
      'font-medium',
      'rounded-md',
      'shadow-sm',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'transition-colors',
      'duration-200',
    ];

    // Size-specific classes
    const sizeClasses = {
      sm: ['px-3', 'py-1.5', 'text-sm'],
      md: ['px-6', 'py-3', 'text-base'],
      lg: ['px-8', 'py-4', 'text-lg'],
    };

    // Add size classes unless custom class overrides them
    const hasCustomPadding =
      this.customClass().includes('p-') ||
      this.customClass().includes('px-') ||
      this.customClass().includes('py-');
    const hasCustomTextSize = this.customClass().includes('text-');
    const hasCustomHeight = this.customClass().includes('h-');

    if (!hasCustomPadding && !hasCustomHeight) {
      baseClasses.push(...sizeClasses[this.size()].slice(0, 2));
    }
    if (!hasCustomTextSize) {
      baseClasses.push(sizeClasses[this.size()][2]);
    }

    // Full width
    if (this.fullWidth()) {
      baseClasses.push('w-full', 'justify-center');
    }

    // If variant is 'custom', only use custom classes for styling
    if (this.variant() === 'custom') {
      return [...baseClasses, ...this.customClass().split(' ')].join(' ');
    }

    // Variant-specific classes
    const variantClasses: Record<string, string[]> = {
      primary: [
        'border-transparent',
        'text-white',
        'bg-primary',
        'hover:bg-primary/90',
        'focus:ring-primary',
      ],
      secondary: [
        'border-gray-300',
        'text-gray-700',
        'bg-white',
        'hover:bg-gray-50',
        'focus:ring-primary',
      ],
      danger: [
        'border-transparent',
        'text-white',
        'bg-red-600',
        'hover:bg-red-700',
        'focus:ring-red-500',
      ],
      success: [
        'border-transparent',
        'text-white',
        'bg-green-600',
        'hover:bg-green-700',
        'focus:ring-green-500',
      ],
      warning: [
        'border-transparent',
        'text-white',
        'bg-yellow-500',
        'hover:bg-yellow-600',
        'focus:ring-yellow-400',
      ],
      custom: [],
    };

    // Combine all classes
    const allClasses = [
      ...baseClasses,
      ...(variantClasses[this.variant()] || []),
      ...this.customClass().split(' ').filter(Boolean),
    ];

    // Remove duplicates while preserving order
    const uniqueClasses = [...new Set(allClasses)];

    return uniqueClasses.join(' ');
  }
}

// Usage in your template for the country dropdown:
/*
<app-button
  (btnClick)="toggleCountryDropdown()"
  variant="custom"
  customClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-right justify-between font-normal hover:bg-gray-50"
  [showIcon]="true"
  iconType="chevron-down"
  iconPosition="right"
>
  <div button-content class="flex items-center justify-between w-full">
    <span class="flex items-center gap-2">
      @if (getSelectedCountryData(); as country) {
        <img [src]="country.flagSvg" [alt]="country.englishName + ' flag'" class="w-6 h-4 object-cover">
        <span>{{ country.arabicName }} ({{ country.phoneCode }})</span>
      } @else {
        <span>اختر الدولة</span>
      }
    </span>
  </div>
</app-button>
*/
