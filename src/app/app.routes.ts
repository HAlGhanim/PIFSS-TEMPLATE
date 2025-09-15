import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'showcase',
    pathMatch: 'full',
  },
  // example route
  {
    path: 'showcase',
    title: 'Component Showcase',
    // once Msal is configured uncomment this
    // canActivate: [MsalGuard],
    // calling component this way for lazy loading
    loadComponent: () =>
      import('../app/pages/showcase.component').then(
        (m) => m.ShowcaseComponent
      ),
  },
];
