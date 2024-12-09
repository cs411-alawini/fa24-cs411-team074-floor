import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // Include Location for navigation
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import both FormsModule and ReactiveFormsModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Material Design modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-create-account',
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
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
})
export class CreateAccountComponent {
  username: string = '';
  password: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  private baseUrl = 'http://127.0.0.1:5000/api';
  private router = inject(Router);
  private location = inject(Location);
  private userService = inject(UserService);  // Inject the UserService


  constructor(private http: HttpClient) {}

  onSubmit() {
    const accountData = { username: this.username, password: this.password };
    this.http.post(`${this.baseUrl}/create-account`, accountData).subscribe(
      (response) => {
        console.log('Account Creation successful');
        this.userService.setUsername(this.username);
        this.successMessage = 'Account created successfully!';
        this.errorMessage = '';
      },
      (error) => {
        console.log('Account Creation failed');
        switch (error.status) {
          // make it so they cant use a list of symbols in their this.username, @ being one of them
          case 403: 
            this.errorMessage = 'Invalid Username. Please only use Alphanumeric + _, ., and -.';
            break;
          default:
            this.errorMessage = 'Failed to create account. Please try again.';
        }
        this.successMessage = '';
      },
    );
  }
  goBack(): void {
    this.router.navigateByUrl('/');
  }
}
