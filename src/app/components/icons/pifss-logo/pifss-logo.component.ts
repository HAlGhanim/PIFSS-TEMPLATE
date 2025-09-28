import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PIFSS_LOGOS } from './pifss-logo.data';
import { LogoVariant } from '../../../interfaces';

@Component({
  selector: 'app-pifss-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./pifss-logo.component.html`,
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
export class PifssLogoComponent {
  variant = input<LogoVariant>('default');
  width = input<number | null>(null);
  height = input<number | null>(null);
  customClass = input<string>('h-12 text-primary');

  private readonly logos = PIFSS_LOGOS;

  logoConfig = computed(() => {
    return this.logos[this.variant()] || this.logos.default;
  });
}
