import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poker-game',
  standalone: true,
  imports: [],
  templateUrl: './poker-game.component.html',
  styleUrl: './poker-game.component.css',
})
export class PokerGameComponent implements OnInit {
  constructor(
    private userService: UserService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  leaveRoom() {
    this.apiService.leaveRoom(this.userService.getUsername());
    this.router.navigate([`/rooms`]);
  }
}
