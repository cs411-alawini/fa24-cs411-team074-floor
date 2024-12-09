import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../services/user.service';  // Import the user service to get the username

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,  // To get the current username
    private router: Router,            // For navigation
    private http: HttpClient           // To make HTTP requests
  ) {}

  canActivate(): Observable<boolean> {
    const username = this.userService.getUsername();  // Get the username from the service

    // if (!username) {
    //   this.router.navigate(['/login']);  // Redirect if no username is found
    //   return of(false);  // Deny access
    // }

    // API call to check if the username is valid
    return this.http.get<any>('http://127.0.0.1:5000/api/check-username', { params: { username: username } }).pipe(
      map((response) => {
        if (response.success) {
          return true;  // Allow access if username is valid
        } else {
          this.router.navigate(['/login']);  // Redirect if username is not valid
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error checking username:', error);
        this.router.navigate(['/login']);  // Redirect if there's an error
        return of(false);  // Deny access
      })
    );
  }
}
