import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthGoogleService } from './auth-google.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service'; // Import the UserService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  private authService = inject(AuthGoogleService);
  private router = inject(Router);
  private location = inject(Location);
  private http = inject(HttpClient);
  private userService = inject(UserService);  // Inject the UserService


  getProfile() {
    return this.authService.getProfile();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  signInWithGoogle() {
    this.authService.login();
  }

  onSubmit() {
    const url = 'http://127.0.0.1:5000/api/login';
    const payload = {
      username: this.username,
      password: this.password,
    };

    this.http.post<any>(url, payload).subscribe(
      (response) => {
        if (response.success) {
          this.userService.setUsername(this.username);
          console.log('Login successful');
          this.router.navigate(['/']); // Navigate to home
        } else {
          console.log('Login failed');
          this.errorMessage = 'Invalid username or password.';
          setTimeout(() => {
            this.errorMessage = '';
          }, 2000);
        }
      },
      (error) => {
        console.error('Error during login', error);
        this.errorMessage = 'There was an error logging in. Please try again.';
      }
    );
  }

  onCreateAccount() {
    this.router.navigate(['/create-account']); // Navigate to Create Account page
  }

  goBack(): void {
    this.router.navigateByUrl('/');
  }

  signOut() {
    this.userService.setUsername('');
    this.authService.logout();
  }
}
