import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


import { TestService } from './test.service';

@Component({
  selector: 'app-data-page',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatPaginator],
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.css'],
})
export class DataPageComponent implements OnInit {
  displayedColumns: string[] = ['column1', 'column2'];
  dataSource = new MatTableDataSource<any>([]);
  rooms: any = null;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private location: Location, private buttonService: TestService) {}

  ngOnInit() {
    const mockData = [
      { column1: 'Data 1', column2: 'Data 2' },
      { column1: 'Data 3', column2: 'Data 4' },
    ];
    this.dataSource.data = mockData;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  goBack(): void {
    this.location.back();
  }

  getRooms(response: any): void {
    this.rooms = response.result
    // for (let r in response.result) {
    //   this.rooms += r.toString()
    // }
    console.log(this.rooms)
  }

  onButton1Click(): void {
    this.buttonService.button1Action().subscribe(
      (response) => console.log(response.message),
      (error) => console.error('Error:', error)
    );

    this.buttonService.getRooms().subscribe(
      (response) => this.getRooms(response),
      (error) => console.error('Error:', error)
    );
  
  }

  onButton2Click(): void {
    this.buttonService.button2Action().subscribe(
      (response) => console.log(response.message),
      (error) => console.error('Error:', error)
    );

    this.buttonService.getRooms().subscribe(
      (response) => this.getRooms(response),
      (error) => console.error('Error:', error)
    );
  }

}



