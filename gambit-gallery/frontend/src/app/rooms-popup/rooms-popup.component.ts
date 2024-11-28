import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Import RouterModule for routing directives
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-rooms-popup',
  standalone: true,
  imports: [CommonModule,RouterModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './rooms-popup.component.html',
  styleUrls: ['./rooms-popup.component.css']
})
export class RoomsPopupComponent {
  constructor(private router: Router) {}
  createRoomPressed: boolean = false
  joinRoomPressed: boolean = false
  validJoinRoomCode: boolean = false
  validCreateRoomCode: boolean = false
  readyToLoad: boolean = false

  navigateBack() {
    this.router.navigate(['/']); // Navigate back to the parent route
  }

  //button that shows textbox to enter room code when create room is clicked
  onCreateRoom() {
    console.log('Create Room clicked');
    this.createRoomPressed = true 
    this.joinRoomPressed = false //only want to show one of the textboxes at a time
  }

  //button that shows textbox to enter room code when join room is clicked
  onJoinRoom() {
    console.log('Join Room clicked');
    this.joinRoomPressed = true 
    this.createRoomPressed = false //only want to show one of the textboxes at a time
    
  }

  //methods called by text box when user tries to enter or join a room
  roomCreated(value: string){
    const roomCode = value.trim();
    //TODO: CHECK IF THIS ROOMCODE ALREADY EXISTS(ONLY SUCCESFUL IF DOESNT EXIST)
    if(roomCode != ''){ //check if not code not empty
        if(true){ //replace with condition to check if roomcode is not already existing
            this.readyToLoad = true
            setTimeout(() => { //wait 2 seconds before proceeding just to show loading screen(can be removed)
                if(true){ //replace with condition to check if #of players is enough
                    console.log("Entering Poker Game")
                    this.router.navigate(['/poker-game', roomCode]); // Pass roomCode as route parameter
                    this.readyToLoad = false
                }
              }, 2000);
        }
    }
  }
  roomJoined(value: string){
    const roomCode = value.trim();
    //TODO: CHECK IF THIS ROOMCODE ALREADY EXISTS(ONLY SUCCESFUL IF DOESNT EXIST)
    if(roomCode != ''){ //check if not code not empty
        if(true){ //replace with condition to check if roomcode is valid and exists
            this.readyToLoad = true
            setTimeout(() => { //wait 5 seconds before proceeding just to show loading screen(can be removed)
                if(true){ //replace with condition to check if #of players is enough
                    console.log("Entering Poker Game")
                    this.router.navigate(['/poker-game', roomCode]); // Pass roomCode as route parameter
                    this.readyToLoad = false
                }
            }, 2000);
            
        }
    }
  }
}
