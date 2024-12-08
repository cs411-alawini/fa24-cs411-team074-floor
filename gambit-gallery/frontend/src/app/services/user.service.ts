import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usernameSource = new BehaviorSubject<string>('');
  currentUsername$ = this.usernameSource.asObservable();

  constructor() {}

  // Set username
  setUsername(username: string): void {
    this.usernameSource.next(username);
  }

  // Get username
  getUsername(): string {
    return this.usernameSource.getValue();
  }
}
