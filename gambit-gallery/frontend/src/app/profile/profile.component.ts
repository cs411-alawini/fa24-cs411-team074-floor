import { ApiService } from './../services/api.service';
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
  constructor(private api: ApiService) {}

  username: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  balance = '';
  recipientUsername: string = '';
  amount: number = 0;
  note: string = '';
  transactionSuccess: boolean = false;
  transactionError: string = '';

  private router = inject(Router);
  private http = inject(HttpClient);
  private userService = inject(UserService); // Inject the UserService
  private authService = inject(AuthGoogleService);

  async ngOnInit() {
    this.username = this.userService.getUsername();
    if (!this.username) {
      console.log('No user logged in, redirecting to login...');
      this.router.navigate(['/login']);
    } else {
      this.balance = await this.api.getBalance(this.username);
    }
  }

  changePassword() {
    this.api
      .changePassword(this.username, this.currentPassword, this.newPassword)
      .then(
        (_) => {
          this.successMessage = 'Password changed successfully.';
          this.errorMessage = '';
          this.currentPassword = '';
          this.newPassword = '';
        },
        (error) => {
          console.error('Error during password change', error);
          this.successMessage = '';
          switch (error.status) {
            case 401:
              this.errorMessage = 'That is not the correct Password.';
              break;
            default:
              this.errorMessage =
                'There was an error changing your password. Please try again.';
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
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (confirmDelete) {
      if (this.authService.isAuthenticated()) {
        this.authService.logout(); // Call logout if it's a Gmail address
      }

      this.api.deleteAccount(this.username).then(
        (response) => {
          if (response.success) {
            console.log('Account deleted successfully');
            this.userService.setUsername('');
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            console.error('Failed to delete account');
            this.errorMessage =
              'There was an error deleting your account. Please try again.';
          }
        },
        (error) => {
          console.error('Error during account deletion', error);
          this.errorMessage =
            'There was an error deleting your account. Please try again.';
        }
      );
    }
  }

  sendFunds() {
    this.api
      .sendFunds(this.username, this.recipientUsername, this.amount, this.note)
      .then(
        async (_) => {
          this.transactionSuccess = true;
          this.transactionError = '';
          this.recipientUsername = '';
          this.amount = 0;
          this.note = '';
          this.balance = await this.api.getBalance(this.username);
        },
        (error) => {
          console.error('Error during sending funds', error);
          this.transactionSuccess = false;
          this.transactionError =
            'There was an error processing your transaction. Please try again.';
          switch (error.status) {
            case 409:
              this.transactionError = 'That User does not exist.';
              break;
            default:
              this.transactionError =
                'There was an error sending funds. Please try again.';
          }
        }
      );
  }

  goBack(): void {
    this.router.navigateByUrl('/');
  }
}
