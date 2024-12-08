import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-data-page',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatPaginator],
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.css'],
})
export class DataPageComponent {
constructor(private location: Location) {}
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



