import { Component, inject, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  private authService = inject(AuthGoogleService);
  private router = inject(Router);
  private location = inject(Location);
  private http = inject(HttpClient);
  private userService = inject(UserService);  // Inject the UserService

  ngOnInit() {
    const savedUsername = this.userService.getUsername();
    if (savedUsername) {
      console.log(`User already logged in as ${savedUsername}, redirecting to profile...`);
      this.router.navigate(['/profile']);
    }
  }

  getProfile() {
    return this.authService.getProfile();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  signInWithGoogle() {
    this.authService.login();
    const email = this.authService.getProfile()?.email; // Assuming the email is available in the profile
    if (email) {
      this.userService.setUsername(email);
      console.log('Logged in with Google, username set as ' + this.userService.getUsername());
    } else {
      console.log('Failed to retrieve email from profile');
    }
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
          console.log('username set as' + this.userService.getUsername())
          this.router.navigate(['/profile']); 
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
