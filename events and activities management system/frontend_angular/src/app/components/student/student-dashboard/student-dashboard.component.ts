import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.component.html'
})
export class StudentDashboardComponent implements OnInit {

  events: any[] = [];
  filteredEvents: any[] = [];
  myEvents: any[] = [];
  student: any = null;

  activeTab = 'events';

  search = '';
  venueFilter = '';
  dateFilter = '';

  token = sessionStorage.getItem('token');

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchProfile();
    this.fetchEvents();
  }

  // ⭐ TAB SWITCH
  setTab(tab: string) {
    this.activeTab = tab;

    if (tab === 'myEvents') {
      this.fetchMyEvents();
    }

    if (tab === 'events') {
      this.fetchEvents();
    }
  }

  // ===== PROFILE =====
  fetchProfile() {
    this.http.get('http://localhost:5000/api/student/profile', {
      headers: { Authorization: 'Bearer ' + this.token }
    }).subscribe(res => this.student = res);
  }

  // ===== EVENTS =====
  fetchEvents() {
    this.http.get<any[]>('http://localhost:5000/api/student/events', {
      headers: { Authorization: 'Bearer ' + this.token }
    }).subscribe(res => {
      this.events = res;
      this.applyFilters();
    });
  }

  // ===== MY EVENTS =====
  fetchMyEvents() {
    this.http.get<any[]>('http://localhost:5000/api/student/my-events', {
      headers: { Authorization: 'Bearer ' + this.token }
    }).subscribe(res => this.myEvents = res);
  }

  // ===== REGISTER =====
  registerEvent(id: string) {
    this.http.post(`http://localhost:5000/api/student/register/${id}`, {}, {
      headers: { Authorization: 'Bearer ' + this.token }
    }).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.fetchMyEvents();
      },
      error: () => alert('Already registered')
    });
  }

  // ===== FILTER =====
  applyFilters() {
    this.filteredEvents = this.events.filter(e => {

      const matchSearch =
        !this.search ||
        e.title.toLowerCase().includes(this.search.toLowerCase());

      const matchVenue =
        !this.venueFilter || e.venue === this.venueFilter;

      const matchDate =
        !this.dateFilter || e.date.startsWith(this.dateFilter);

      return matchSearch && matchVenue && matchDate;
    });
  }

  resetFilters() {
    this.search = '';
    this.venueFilter = '';
    this.dateFilter = '';
    this.applyFilters();
  }

  // ⭐ VENUE DROPDOWN
  get venues() {
    return [...new Set(this.events.map(e => e.venue))];
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
