import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service'; // Import the UserService
import { AuthGoogleService } from '../login/auth-google.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  username: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  private router = inject(Router);
  private http = inject(HttpClient);
  private userService = inject(UserService); // Inject the UserService
  private authService = inject(AuthGoogleService);


  ngOnInit() {
    this.username = this.userService.getUsername();
    if (!this.username) {
      console.log('No user logged in, redirecting to login...');
      this.router.navigate(['/login']);
    }
  }

  changePassword() {
    const url = 'http://127.0.0.1:5000/api/change-password';
    const payload = {
      username: this.username,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    };

    this.http.post<any>(url, payload).subscribe(
      (response) => {
        this.successMessage = 'Password changed successfully.';
        this.errorMessage = '';
        this.currentPassword = '';
        this.newPassword = '';
      },
      (error) => {
        console.error('Error during password change', error);
        this.successMessage = '';
        switch(error.status) {
          case 401:
            this.errorMessage = 'That is not the correct Password.';
            break;
          default: 
            this.errorMessage = 'There was an error changing your password. Please try again.';
        }
      }
    );
  }

  signOut() {
    if (this.authService.isAuthenticated()) {
      this.authService.logout(); // Call logout if it's a Gmail address
    }
    this.userService.setUsername('');
    this.router.navigate(['/login']);
  }

  deleteAccount() {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    
    if (confirmDelete) {
      const url = 'http://127.0.0.1:5000/api/delete-account'; // Assuming you have an endpoint for deleting the account
      const payload = { username: this.username };

      if (this.authService.isAuthenticated()) {
        this.authService.logout(); // Call logout if it's a Gmail address
      }

      this.http.delete<any>(url, { body: payload }).subscribe(
        (response) => {
          if (response.success) {
            console.log('Account deleted successfully');
            this.userService.setUsername('');
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            console.error('Failed to delete account');
            this.errorMessage = 'There was an error deleting your account. Please try again.';
          }
        },
        (error) => {
          console.error('Error during account deletion', error);
          this.errorMessage = 'There was an error deleting your account. Please try again.';
        }
      );
    }
  }

  goBack(): void {
    this.router.navigateByUrl('/');
  }
}