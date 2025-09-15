// import { Injectable, inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
// import {
//   AuthenticationResult,
//   InteractionStatus,
//   PopupRequest,
//   RedirectRequest,
// } from '@azure/msal-browser';
// import { Observable, from, of } from 'rxjs';
// import { catchError, filter, map, take } from 'rxjs/operators';
// import { environment } from '../../../environment';

// @Injectable({
//   providedIn: 'root',
// })
// export class MsalAuthService {
//   private msalService = inject(MsalService);
//   private msalBroadcastService = inject(MsalBroadcastService);
//   private router = inject(Router);

//   private readonly DEFAULT_SCOPES = environment.msal.entraId.apiScopes;
//   // DEFAULT_ROUTE for example /reports/gcc is the default route in GCC-EAB project
//   // in app.routes.ts add the landing / home page route here
//   // https://192.168.100.253/gcceab/#/reports/gcc
//   private readonly DEFAULT_ROUTE = 'YOUR-OWN-DEFAULT-ROUTE';
//   private readonly REDIRECT_URL_KEY = 'redirectUrl';

//   /**
//    * Initialize authentication handling
//    * Called once from AppComponent
//    */
//   initializeAuth(): void {
//     this.msalService.handleRedirectObservable().subscribe({
//       next: (result) => {
//         if (result) {
//           this.handlePostLogin();
//         }
//       },
//       error: (error) => console.error('Login error:', error),
//     });

//     this.msalBroadcastService.inProgress$
//       .pipe(
//         filter(
//           (status: InteractionStatus) => status === InteractionStatus.None
//         ),
//         take(1)
//       )
//       .subscribe(() => {
//         this.setActiveAccount();
//         this.checkInitialRoute();
//       });
//   }

//   /**
//    * Handle post-login navigation
//    */
//   private handlePostLogin(): void {
//     const redirectUrl = sessionStorage.getItem(this.REDIRECT_URL_KEY);
//     if (redirectUrl) {
//       sessionStorage.removeItem(this.REDIRECT_URL_KEY);
//       this.router.navigateByUrl(redirectUrl);
//     }
//   }

//   /**
//    * Check and redirect on initial load
//    */
//   private checkInitialRoute(): void {
//     if (this.isAuthenticated() && this.isAtRoot()) {
//       this.router.navigate([this.DEFAULT_ROUTE]);
//     }
//   }

//   /**
//    * Check if user is at root
//    */
//   private isAtRoot(): boolean {
//     const hashRoute = window.location.hash.slice(2);
//     return !hashRoute || hashRoute === '';
//   }

//   /**
//    * Set active account
//    */
//   private setActiveAccount(): void {
//     const accounts = this.msalService.instance.getAllAccounts();
//     if (accounts.length > 0) {
//       this.msalService.instance.setActiveAccount(accounts[0]);
//     }
//   }

//   /**
//    * Store intended URL for post-login redirect
//    */
//   storeRedirectUrl(url: string): void {
//     sessionStorage.setItem(this.REDIRECT_URL_KEY, url);
//   }

//   /**
//    * Check if user is authenticated
//    */
//   isAuthenticated(): boolean {
//     return this.msalService.instance.getAllAccounts().length > 0;
//   }

//   /**
//    * Get the current user
//    */
//   getCurrentUser() {
//     const accounts = this.msalService.instance.getAllAccounts();
//     return accounts.length > 0 ? accounts[0] : null;
//   }

//   /**
//    * Get user display name
//    */
//   getUserDisplayName(): string {
//     const user = this.getCurrentUser();
//     return user?.name || user?.username || 'User';
//   }

//   /**
//    * Get user email
//    */
//   getUserEmail(): string {
//     const user = this.getCurrentUser();
//     return user?.username || '';
//   }

//   /**
//    * Get complete user information as JSON
//    */
//   getUserInfo(): any {
//     const user = this.getCurrentUser();
//     return user ? JSON.parse(JSON.stringify(user)) : null;
//   }

//   /**
//    * Login with popup
//    */
//   loginPopup(): Observable<AuthenticationResult> {
//     const loginRequest: PopupRequest = {
//       scopes: this.DEFAULT_SCOPES,
//     };

//     return from(this.msalService.loginPopup(loginRequest)).pipe(
//       map((response) => {
//         if (response) {
//           this.msalService.instance.setActiveAccount(response.account);
//         }
//         return response;
//       }),
//       catchError((error) => {
//         console.error('Login failed', error);
//         throw error;
//       })
//     );
//   }

//   /**
//    * Login with redirect
//    */
//   loginRedirect(customScopes?: string[]): void {
//     const loginRequest: RedirectRequest = {
//       scopes: customScopes || this.DEFAULT_SCOPES,
//     };
//     this.msalService.loginRedirect(loginRequest);
//   }

//   /**
//    * Logout with popup
//    */
//   logoutPopup(): Observable<void> {
//     const logoutRequest = {
//       account: this.getCurrentUser(),
//     };
//     return from(this.msalService.logoutPopup(logoutRequest));
//   }

//   /**
//    * Logout with redirect
//    */
//   logoutRedirect(): void {
//     const logoutRequest = {
//       account: this.getCurrentUser(),
//     };
//     this.msalService.logoutRedirect(logoutRequest);
//   }

//   /**
//    * Get access token silently
//    */
//   getAccessToken(customScopes?: string[]): Observable<string | null> {
//     const account = this.getCurrentUser();
//     if (!account) {
//       return of(null);
//     }

//     const request = {
//       scopes: customScopes || this.DEFAULT_SCOPES,
//       account: account,
//     };

//     return from(this.msalService.acquireTokenSilent(request)).pipe(
//       map((response) => response.accessToken),
//       catchError((error) => {
//         console.error('Token acquisition failed', error);
//         return from(this.msalService.acquireTokenPopup(request)).pipe(
//           map((response) => response.accessToken),
//           catchError(() => of(null))
//         );
//       })
//     );
//   }
// }
