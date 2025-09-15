import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalBroadcastService,
  MsalGuard,
  MsalInterceptor,
  MsalService,
} from '@azure/msal-angular';
import { routes } from './app.routes';
import {
  MSALGuardConfigFactory,
  MSALInstanceFactory,
  MSALInterceptorConfigFactory,
} from './config/auth.config';
import { ErrorInterceptor, loadingInterceptor } from './interceptors/index';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
      withInterceptors([ErrorInterceptor, loadingInterceptor])
    ),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    { provide: LocationStrategy, useClass: HashLocationStrategy },

    // uncomment this when msal is configured

    // {
    //   provide: MSAL_INSTANCE,
    //   useFactory: MSALInstanceFactory,
    // },
    // {
    //   provide: MSAL_GUARD_CONFIG,
    //   useFactory: MSALGuardConfigFactory,
    // },
    // {
    //   provide: MSAL_INTERCEPTOR_CONFIG,
    //   useFactory: MSALInterceptorConfigFactory,
    // },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: MsalInterceptor,
    //   multi: true,
    // },
    // MsalService,
    // MsalGuard,
    // MsalBroadcastService,
  ],
};
