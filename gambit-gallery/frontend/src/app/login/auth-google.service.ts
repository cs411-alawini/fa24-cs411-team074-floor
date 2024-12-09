import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth-config';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  private oAuthService = inject(OAuthService);
  private router = inject(Router);
  profile = signal<any>(null);
  private userService = inject(UserService);
  private baseUrl = 'http://127.0.0.1:5000/api';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {
    this.initConfiguration();
  }

  initConfiguration() {
    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();

    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oAuthService.hasValidIdToken()) {
        const claims = this.oAuthService.getIdentityClaims();
        this.profile.set(claims);

        const email = claims["email"];
        this.userService.setUsername(email);
        console.log("Google login successful. Email: " + email);

        // Trigger account creation in the backend
        this.createAccount(email);
      }
    });
  }

  // Account creation method
  createAccount(email: string) {
    const accountData = { username: email, password: 'floor' };
    console.log('Creating account with email:', email);  // Add this line for debugging
    this.http.post(`${this.baseUrl}/create-account-oauth`, accountData).subscribe({
      next: (response) => {
        this.successMessage = 'Account successfully created.';
        console.log(this.successMessage);
      },
      error: (error) => {
        this.errorMessage = 'Failed to create account.';
        console.error(this.errorMessage, error);
      },
    });
  }
  
  login() {
    this.oAuthService.initCodeFlow(); // For PKCE flow
    console.log('Google OAuth login initiated.');
  }

  logout() {
    this.oAuthService.logOut();
    this.profile.set(null);
    console.log('User logged out.');
  }

  isAuthenticated(): boolean {
    return this.oAuthService.hasValidIdToken();
  }

  getProfile() {
    return this.profile() || {};
  }
}
