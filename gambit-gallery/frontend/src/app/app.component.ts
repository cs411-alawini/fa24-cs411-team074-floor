import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { RouterModule } from '@angular/router'; // Include routing

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule,RouterModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  message = '';
  title = 'Gambit Gallery'

  constructor(private apiService: ApiService) {}
}

