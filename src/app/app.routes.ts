import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'YOUR-DEFAULT-ROUTE',
    pathMatch: 'full',
  },
  // example route
  {
    path: 'whatever',
    title: 'ARABIC-TITLE-OF-THE-PAGE',
    // once Msal is configured uncomment this
    // canActivate: [MsalGuard],
    // calling component this way for lazy loading
    // loadComponent: () => import('../app/pages/YOUR-COMPONENT.TS-PAGE').then(
    //     (m) => m.YOUR-COMPONENT
    //   ),
  },
];
