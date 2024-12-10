import { ApiService } from './../services/api.service';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../services/user.service'; // Import the UserService
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-data-page',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatPaginator, MatCardModule, CommonModule],
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.css'],
})
export class DataPageComponent {
constructor(private api: ApiService, private location: Location) {}
  private userService = inject(UserService); // Inject the UserService
  username = this.userService.getUsername()
  private http = inject(HttpClient);

  async ngOnInit(): Promise<void> {
    // Fetch the data from your API
    this.user_performance.data = await this.api.getUserPerformance(this.username);
    this.user_activity.data = await this.api.getUserActivity(this.username);
  }

  // displayedColumns: string[] = ['action', 'avgBalance', 'winRate'];
  user_performance = {
    columns: ['action', 'avgBalance', 'winRate'],
    data: [],
  }
  // getPerformance(username: string): void {
  //   this.data = await this.api.getUserPerformance(username);
  // }
  
  user_activity = {
    columns: ["Date", "GameCount", "NonGameCount", "TotalActivity"],
    data: [],
  }

  dataSourceMoves = [
    { action: 'Raise', balance: '+200', winRate: '75%' },
    { action: 'Call', balance: '-50', winRate: '40%' },
  ];
  movesColumns: string[] = ['action', 'balance', 'winRate'];

  dataSourceHistory = [
    { user: 'User1', pos: 5, neg: 3, zero: 2 },
    { user: 'User2', pos: 10, neg: 8, zero: 0 },
  ];
  historyColumns: string[] = ['user', 'positive', 'negative', 'zero'];

  goBack(): void {
    this.location.back();
  }

}



