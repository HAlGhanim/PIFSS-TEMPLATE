import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation,
} from '@azure/msal-browser';
import {
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
} from '@azure/msal-angular';
import { environment } from '../../environment';

const DEFAULT_SCOPES = environment.msal.entraId.apiScopes;

export const msalConfig = {
  auth: {
    clientId: environment.msal.entraId.clientId,
    authority: environment.msal.entraId.authority,
    redirectUri: environment.msal.redirectUri,
    postLogoutRedirectUri: environment.msal.redirectUri,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: any, message: any, containsPii: any) => {
        if (containsPii) return;

        const logFunctions = [
          console.error,
          console.warn,
          console.info,
          console.debug,
        ];

        logFunctions[level]?.(message);
      },
      logLevel: environment.production ? 0 : 3,
    },
  },
};

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: DEFAULT_SCOPES,
    },
  };
}

// This attaches the bearer token with every http request
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();

  const protectedEndpoints = [environment.baseurl];

  protectedEndpoints.forEach((endpoint) => {
    protectedResourceMap.set(endpoint + '*', DEFAULT_SCOPES);
  });

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}
