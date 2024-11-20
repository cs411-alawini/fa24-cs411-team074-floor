import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TestService {
  private baseUrl = 'http://127.0.0.1:5000/api';
  
  constructor(private http: HttpClient) {}

  button1Action(): Observable<any> {
    return this.http.get(`${this.baseUrl}/create_room`, {});
  }

  button2Action(): Observable<any> {
    return this.http.get(`${this.baseUrl}/delete_room`, {});
  }

  getRooms(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_rooms`, {})
  }
}
