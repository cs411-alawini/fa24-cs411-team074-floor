import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userStateSubject = new BehaviorSubject<string>('');
  currentUser$ = this.userStateSubject.asObservable();

  // Method to set the username
  setUsername(username: string): void {
    this.userStateSubject.next(username);
    localStorage.setItem('username', username); // Persist data in localStorage
  }

  // Method to get the username
  getUsername(): string {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.userStateSubject.next(storedUsername);
      return storedUsername;
    }
    return '';
  }

  // Method to clear the state
  clearState(): void {
    this.userStateSubject.next('');
    localStorage.removeItem('username');
  }
}
