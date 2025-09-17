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
      import('./pages/showcase/showcase.component').then(
        (m) => m.ShowcaseComponent
      ),
  },
  {
    path: 'employee-list',
    title: 'Employee list',
    loadComponent: () =>
      import('./pages/employee-list/employee-list.component').then(
        (m) => m.EmployeeListComponent
      ),
  },
];
