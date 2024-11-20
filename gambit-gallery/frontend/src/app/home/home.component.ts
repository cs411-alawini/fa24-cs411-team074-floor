// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service'; // Adjust the path as necessary
import { RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  message = '';
  fetched = false;

  constructor(private apiService: ApiService) {}

  toggleMessage() {
    if (this.fetched) {
      this.message = '';
    } else {
      this.apiService.getHello().subscribe((data) => {
        this.message = data.message;
      });
    }
    this.fetched = !this.fetched;
  }

  //TO DO: POKER GAME PAGE REDIRECT

}
