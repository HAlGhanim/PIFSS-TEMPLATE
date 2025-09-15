import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalAuthService } from './services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private msalAuthService = inject(MsalAuthService);

  // uncomment once msal is configured

  // isAuthenticated(): boolean {
  //   return this.msalAuthService.isAuthenticated();
  // }

  ngOnInit(): void {
    // this.msalAuthService.initializeAuth();
  }
}
