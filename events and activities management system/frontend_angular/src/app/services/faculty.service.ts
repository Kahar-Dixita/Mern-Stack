import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {

  private baseUrl = 'http://localhost:5000/api/faculty';

  constructor(private http: HttpClient) {}

  private authHeader() {
    return {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      }
    };
  }

  createEvent(data: any) {
    return this.http.post(`${this.baseUrl}/create-event`, data, this.authHeader());
  }
}
