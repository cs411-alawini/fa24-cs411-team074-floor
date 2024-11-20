import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Import RouterModule for routing directives
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { Location } from '@angular/common'; // Import Location service

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private location: Location) {}

  //CHANGE THIS TO CALL USER AUTH API -> pass this.username,this.password
  onSubmit() {
    //set default username/password to temp values
    if (this.username === 'temp' && this.password === 'temp') {
      console.log('Login successful');
      this.router.navigate(['/']); //on successful login, route back to home page
    } else {
      console.log('Login failed');
      this.errorMessage = 'Invalid username or password.';

      // Set a timer to automatically clear the error message after 3 seconds
      setTimeout(() => {
        this.errorMessage = '';
      }, 2000); // 2 seconds
    }
  }

  //TODO - CALL API THAT SUPPORTS ADD CREATE ACCOUNT FUNCTIONALITY : CHECK FOR EXISTING USER, IF NOT, ADD TO DB
  onCreateAccount(){
    //pass
  }

  // Method to navigate back
  goBack(): void {
    this.location.back();
  }

} 
