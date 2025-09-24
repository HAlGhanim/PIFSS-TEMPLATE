import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
// import { MsalAuthService } from '../../services/app-services/msal-auth.service';
import { NavigationLink } from '../../interfaces';
import { PifssLogoComponent } from '../icons/pifss-logo/pifss-logo.component';
import { SvgIconComponent } from '../icons/svg-icon/svg-icon.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    RouterLinkActive,
    PifssLogoComponent,
    SvgIconComponent,
    CommonModule,
  ],
  templateUrl: './navbar.component.html',
  styles: [
    `
      /* Ensure proper spacing for fixed elements */
      :host {
        display: block;
      }

      /* Smooth scrollbar for sidebar */
      aside::-webkit-scrollbar {
        width: 6px;
      }

      aside::-webkit-scrollbar-track {
        background: #f3f4f6;
      }

      aside::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 3px;
      }

      aside::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
      }
    `,
  ],
})
export class NavbarComponent {
  // Uncomment once msal is configured
  // authService = inject(MsalAuthService);
  private router = inject(Router);

  // Navigation links configuration
  links: NavigationLink[] = [
    {
      label: 'عرض المكونات',
      path: '/showcase',
      icon: 'globe',
      // badge: 'جديد',
      // badgeColor: 'success'
    },
    {
      label: 'قائمة الموظفين',
      path: '/employee-list',
      icon: 'users',
      // badge: 12,
      // badgeColor: 'primary'
    },
    // Example with children (sub-menu)
    // {
    //   label: 'التقارير',
    //   path: '/reports',
    //   icon: 'document',
    //   children: [
    //     {
    //       label: 'تقرير شهري',
    //       path: '/reports/monthly',
    //       icon: 'chevronLeft'
    //     },
    //     {
    //       label: 'تقرير سنوي',
    //       path: '/reports/annual',
    //       icon: 'chevronLeft'
    //     }
    //   ]
    // }
  ];

  filteredLinks = computed(() => {
    return this.links.filter((link) => !link.disabled);
  });

  logout() {
    // this.authService.logoutRedirect();
  }

  getUserInitials(): string {
    // Uncomment and use when MSAL is configured
    // const name = this.authService.getUserDisplayName();

    const name = 'User'; // Placeholder

    if (!name) return 'U';

    const arabicRegex = /[\u0600-\u06FF]/;
    const hasArabic = arabicRegex.test(name);

    if (hasArabic) {
      const arabicPart = name.match(/[\u0600-\u06FF\s]+/)?.[0]?.trim();
      if (arabicPart) {
        return arabicPart[0];
      }
    }

    return name.trim()[0].toUpperCase();
  }

  isActiveRoute(path: string): boolean {
    return this.router.url.startsWith(path);
  }
}
