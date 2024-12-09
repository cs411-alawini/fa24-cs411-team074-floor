import { Component, OnInit } from '@angular/core';
import { RouterModule, Router  } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from '../services/api.service';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-show-rooms',
  standalone: true,
  imports: [HttpClientModule, RouterModule, CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './show-rooms.component.html',
  styleUrl: './show-rooms.component.css'
})
export class ShowRoomsComponent implements OnInit{
  constructor(private apiService: ApiService, private router: Router, private location: Location, private http: HttpClient) {}

  table_columns: string[] = ['RoomID', 'Log', 'ChatLog']
  dataSource = new MatTableDataSource([]);

  ngOnInit(): void {
    this.apiService.getRooms().subscribe((data) => {
      //console.log("API Response: ", data);

      this.dataSource.data = data.result.map(
        ([RoomID, Log, ChatLog]: [any, any, any]) => ({
          RoomID,
          Log,
          ChatLog,
        })
      ); 
    });

    //console.log("DATA SOURCE -> ", this.dataSource)
  }

  goBack(): void {
    this.location.back();
  }

}