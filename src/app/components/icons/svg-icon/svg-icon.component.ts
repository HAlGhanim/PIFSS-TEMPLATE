import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconService } from '../../../services';

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./svg-icon.component.html`,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class SvgIconComponent {
  private iconService = inject(IconService);

  // Inputs
  name = input<string>('');
  width = input<number>(24);
  height = input<number>(24);
  customClass = input<string>('');
  strokeWidth = input<number>(2);
  strokeLinecap = input<'round' | 'butt' | 'square'>('round');
  strokeLinejoin = input<'round' | 'miter' | 'bevel'>('round');
  fill = input<string>('none');

  defaultClass = 'transition-all duration-200';

  iconConfig = computed(() => {
    return this.iconService.getIcon(this.name());
  });

  iconPath = computed(() => {
    return this.iconConfig().path;
  });

  fillRule = computed(() => {
    return this.iconConfig().fillRule;
  });

  clipRule = computed(() => {
    return this.iconConfig().clipRule;
  });
}
