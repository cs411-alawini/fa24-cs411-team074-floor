import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Import RouterModule for routing directives
import { Location } from '@angular/common'; // Import Location service
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, MatTableModule,MatPaginatorModule,MatSortModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class TransactionsComponent {
    constructor(private router: Router, private location: Location) {}
    table_columns : string[] = ["from","to","amount"]
    data =[
        {from: "Bob", to: "John", amount:"5"},
        {from: "Bob", to: "Leah", amount:"5"},
        {from: "Bob", to:"Texas Holdem", amount:"15"}
    ]
    dataSource = new MatTableDataSource(this.data);

    // Method to navigate back
    goBack(): void {
        this.location.back();
      }
}
  