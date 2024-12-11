import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from '../services/api.service';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-show-rooms',
  standalone: true,
  imports: [
    HttpClientModule,
    RouterModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
  ],
  templateUrl: './show-rooms.component.html',
  styleUrls: ['./show-rooms.component.css'],
})
export class ShowRoomsComponent implements OnInit {
  searchTerm: string = '';
  roomAdd: string = '';
  table_columns: string[] = ['RoomID'];
  // table_columns: string[] = ['RoomID', 'Log', 'ChatLog']
  dataSource = new MatTableDataSource<{ RoomID: string }>([]);
  filteredDataSource = new MatTableDataSource<{ RoomID: string }>([]);
  selection = new SelectionModel<any>(false, []);
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private apiService: ApiService,
    private router: Router,
    private location: Location,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    this.fetch();
  }

  async filterRooms() {
    this.filteredDataSource.data = this.dataSource.data;
    if (!this.searchTerm) {
      this.filteredDataSource.data = this.dataSource.data;
    }
    const lowerTerm = this.searchTerm.toLowerCase();
    this.filteredDataSource.data = this.dataSource.data.filter((room) =>
      room.RoomID.toLowerCase().includes(lowerTerm)
    );
  }

  async fetch() {
    this.dataSource.data = await this.apiService.getRooms();
    this.filterRooms();
  }

  goBack(): void {
    this.location.back();
  }

  addRoom(): void {
    this.apiService.createRoom(this.roomAdd).then(() => {
      this.fetch();
    });
  }

  deleteRoom(): void {
    this.apiService.deleteRoom(this.selection.selected[0]['RoomID']).then(() => {
      this.fetch();
    });
  }

  joinRoom(): void {
    if (this.selection.hasValue()) {
      const room = this.selection.selected[0]['RoomID'];
      this.apiService
        .joinRoom(this.userService.getUsername(), room)
        .then((r) => {
          if (r.success) {
            console.log('Join successful');
            this.router.navigate([`/poker-game/${room}`]);
          } else {
            console.log('Join failed');
            this.errorMessage = 'Invalid username or password.';
            setTimeout(() => {
              this.errorMessage = '';
            }, 2000);
          }
        });
    } else {
      console.log('no');
      this.errorMessage = 'No Room selected!';
      setTimeout(() => {
        this.errorMessage = '';
      }, 2000);
    }
  }
}
