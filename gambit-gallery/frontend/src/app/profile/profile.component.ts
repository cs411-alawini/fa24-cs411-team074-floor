import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html', // Template for the component
  styleUrls: ['./profile.component.scss'], // Optional stylesheet for the component
})
export class ProfileComponent implements OnInit {
  username: string = '';

  userProfile: any = null;
  errorMessage: string = '';
  loading: boolean = true;

  private userService = inject(UserService); // Inject UserService

  ngOnInit() {
    this.username = this.userService.getUsername();
    console.log('Welcome, ' + this.username);
    this.loading = false;
  }
}

  // checkUserValidity(username: string) {
  //   // Call the API to check if the username is valid
  //   const url = `http://127.0.0.1:5000/api/check-username/${username}`;
    
  //   this.http.get<any>(url).subscribe(
  //     (response) => {
  //       if (response.valid) {
  //         this.userProfile = response.profile; // Assuming the API returns profile data
  //         this.loading = false;
  //       } else {
  //         this.errorMessage = 'Invalid username';
  //         this.loading = false;
  //         setTimeout(() => {
  //           this.router.navigate(['/login']); // Redirect to login page if invalid username
  //         }, 2000);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error checking username validity', error);
  //       this.errorMessage = 'There was an error checking the username.';
  //       this.loading = false;
  //     }
  //   );
  // }
// }
