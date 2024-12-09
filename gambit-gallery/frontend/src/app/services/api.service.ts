import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:5000/api';

  constructor(private http: HttpClient) {}

  getHello(): Observable<any> {
    return this.http.get(`${this.apiUrl}/hello`);
  }
  // Fetch data from the Flask API
  getData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/data`);
  }

  getTransaction(user: String): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_transactions/${user}`);
  }

  getSkins(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_skins`)
  }
  
  getRooms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_rooms`)
  }

  createRoom(): Observable<any> {
    return this.http.get(`${this.apiUrl}/create_room`)
  }

  deleteRoom(): Observable<any> {
    return this.http.get(`${this.apiUrl}/delete_room`)
  }

}

