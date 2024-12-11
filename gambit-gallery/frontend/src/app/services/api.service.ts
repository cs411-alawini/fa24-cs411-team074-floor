import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url = 'http://127.0.0.1:5000/api';

  constructor(private http: HttpClient) {}

  getHello(): Observable<any> {
    return this.http.get(`${this.url}/hello`);
  }

  async getTransaction(user: String): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.url}/get-transactions/${user}`));
  }

  async getSkins(): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.url}/get-skins`));
  }
  
  async getRooms(): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.url}/get-rooms`));
  }

  async createRoom(room: String): Promise<any> {
    const payload = {
      room: room
    }
    return await firstValueFrom(this.http.post(`${this.url}/create-room`, payload));
  }

  async deleteRoom(room: String): Promise<any> {
    const payload = {
      room: room
    };
    return await firstValueFrom(this.http.post(`${this.url}/delete-room`, payload));
  }

  async joinRoom(uid: string, room: string): Promise<any> {
    const payload = {
      username: uid,
      room: room
    }
    return await firstValueFrom(this.http.post(`${this.url}/join-room`, payload));
  }

  async getBalance(uid: String): Promise<any> {
    const d = await firstValueFrom<any>(this.http.get<any>(`${this.url}/get-balance/${uid}`))
    // console.log(d)
    return d['balance']
  }
  
  async changePassword(uid: String, currPass: String, newPass: String): Promise<any> {
    const payload = {
      username: uid,
      currentPassword: currPass,
      newPassword: newPass,
    };
    return await firstValueFrom(this.http.post<any>(`${this.url}/change-password`, payload));
  }

  async deleteAccount(uid: String): Promise<any> {
    const payload = { username: uid };
    return await firstValueFrom(this.http.post(`${this.url}/delete-account`, payload));
  }

  async sendFunds(sender: String, recip: String, amnt: number, note: String): Promise<any> {
    const payload = {
      username: sender,
      recipientUsername: recip,
      amount: amnt,
      note: note,
    };
    return await firstValueFrom(this.http.post<any>(`${this.url}/send-funds`, payload));
  }

  async getUserPerformance(uid: String): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.url}/get-user-performance/${uid}`))
  }

  async getUserActivity(uid: String): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.url}/get-user-activity/${uid}`))
  }

}

