import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'http://localhost:5000/api/admin';

  constructor(private http: HttpClient) {}

  private headers() {
    return new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    });
  }

  getProfile() {
    return this.http.get(`${this.baseUrl}/profile`, { headers: this.headers() });
  }

  getEvents() {
    return this.http.get<any[]>(`${this.baseUrl}/events`, { headers: this.headers() });
  }

  getUsers() {
    return this.http.get<any[]>(`${this.baseUrl}/users`, { headers: this.headers() });
  }

  approveEvent(id: string) {
    return this.http.put(`${this.baseUrl}/event/approve/${id}`, {}, { headers: this.headers() });
  }

  rejectEvent(id: string) {
    return this.http.put(`${this.baseUrl}/event/reject/${id}`, {}, { headers: this.headers() });
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}/user/${id}`, { headers: this.headers() });
  }
}
