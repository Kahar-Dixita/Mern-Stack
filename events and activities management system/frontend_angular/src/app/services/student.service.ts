import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseUrl = 'http://localhost:5000/api/student';

  constructor(private http: HttpClient) {}

  private authHeader() {
    return {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      }
    };
  }

  getProfile() {
    return this.http.get(`${this.baseUrl}/profile`, this.authHeader());
  }

  getEvents() {
    return this.http.get<any[]>(`${this.baseUrl}/events`, this.authHeader());
  }

  getMyEvents() {
    return this.http.get<any[]>(`${this.baseUrl}/my-events`, this.authHeader());
  }

  registerEvent(id: string) {
    return this.http.post(`${this.baseUrl}/register/${id}`, {}, this.authHeader());
  }
}
