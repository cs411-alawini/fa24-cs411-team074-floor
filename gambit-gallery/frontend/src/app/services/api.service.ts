import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

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
    return this.http.get(`${this.apiUrl}/get-transactions/${user}`);
  }

  getSkins(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-skins`)
  }
  
  getRooms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-rooms`)
  }

  createRoom(): Observable<any> {
    return this.http.get(`${this.apiUrl}/create-room`)
  }

  deleteRoom(): Observable<any> {
    return this.http.get(`${this.apiUrl}/delete-room`)
  }

  async getBalance(uid: String): Promise<any> {
    const d = await firstValueFrom<any>(this.http.get<any>(`${this.apiUrl}/get-balance/${uid}`))
    console.log(d)
    return d['balance']
  }
  
  changePassword(uid: String, currPass: String, newPass: String): Observable<any> {
    const payload = {
      username: uid,
      currentPassword: currPass,
      newPassword: newPass,
    };
    return this.http.post<any>(`${this.apiUrl}/change-password`, payload);
  }

  deleteAccount(uid: String): Observable<any> {
    const payload = { username: uid };
    return this.http.delete<any>(`${this.apiUrl}/delete-account`)
  }

  sendFunds(sender: String, recip: String, amnt: number, note: String): Observable<any> {
    const payload = {
      username: sender,
      recipientUsername: recip,
      amount: amnt,
      note: note,
    };
    return this.http.post<any>(`${this.apiUrl}/send-funds`, payload);
  }

  async getUserPerformance(uid: String): Promise<any> {
  //   [
  //     {"date": d, "gameCount": gc, "nonGameCount": ngc, "totalActivity": ta}
  //     for d, gc, ngc, ta in results
  // ]
    return await firstValueFrom(this.http.get(`${this.apiUrl}/get-user-performance/${uid}`))
  }

  async getUserActivity(uid: String): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.apiUrl}/get-user-activity/${uid}`))
  }

}

