import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { MsalAuthService } from './services';
import { NavbarComponent } from './components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  // uncomment once msal is configured

  // private msalAuthService = inject(MsalAuthService);

  // isAuthenticated(): boolean {
  //   return this.msalAuthService.isAuthenticated();
  // }

  ngOnInit(): void {
    // this.msalAuthService.initializeAuth();
  }
}
