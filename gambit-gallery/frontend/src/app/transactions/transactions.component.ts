import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Import RouterModule for routing directives
import { Location } from '@angular/common'; // Import Location service
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';

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
    private userService: UserService,
    private apiService: ApiService,
    private router: Router,
    private location: Location
  ) {}

  table_columns: string[] = ['date', 'from', 'to', 'amount', 'description'];
  dataSource = new MatTableDataSource([]);

  async ngOnInit() {
    this.dataSource.data = await this.apiService.getTransaction(this.userService.getUsername())
  }

  // Method to navigate back
  goBack(): void {
    this.location.back();
  }
}
