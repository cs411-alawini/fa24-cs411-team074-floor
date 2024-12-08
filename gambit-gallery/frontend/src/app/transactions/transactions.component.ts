import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Import RouterModule for routing directives
import { Location } from '@angular/common'; // Import Location service
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class TransactionsComponent {
  constructor(
    private apiService: ApiService,
    private router: Router,
    private location: Location
  ) {}

  table_columns: string[] = ['date', 'from', 'to', 'amount', 'description'];
  dataSource = new MatTableDataSource([]);

  ngOnInit() {
    this.fetchData();
  }

  fetchData(): void {
    this.apiService.getTransaction('TEXAS_HOLDEM').subscribe((data) => {
      this.dataSource.data = data;
    });
    // console.log(this.dataSource.data);
  }

  // Method to navigate back
  goBack(): void {
    this.location.back();
  }
}
