import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
// import { MsalAuthService } from '../../services/app-services/msal-auth.service';
import { PifssLogoHComponent } from '../icons/pifss-logo-h/pifss-logo-h.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, RouterLinkActive, PifssLogoHComponent, CommonModule],
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
  //uncomment once msal is configured
  // authService = inject(MsalAuthService);
  private router = inject(Router);

  links = [
    {
      label: 'showcase',
      path: '/showcase',
      icon: 'WHATEVER',
    },
    {
      label: 'employee list',
      path: '/employee-list',
      icon: 'WHATEVER2',
    },
  ];

  logout() {
    // this.authService.logoutRedirect();
  }

  // getUserInitials(): string {
  //   const name = this.authService.getUserDisplayName();

  //   if (!name) return 'U';

  //   const arabicRegex = /[\u0600-\u06FF]/;
  //   const hasArabic = arabicRegex.test(name);

  //   if (hasArabic) {
  //     const arabicPart = name.match(/[\u0600-\u06FF\s]+/)?.[0]?.trim();
  //     if (arabicPart) {
  //       return arabicPart[0];
  //     }
  //   }

  //   return name.trim()[0].toUpperCase();
  // }

  isActiveRoute(path: string): boolean {
    return this.router.url === path;
  }
}
