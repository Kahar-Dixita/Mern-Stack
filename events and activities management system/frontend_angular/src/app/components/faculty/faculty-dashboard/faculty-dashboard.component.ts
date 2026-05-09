import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-faculty-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './faculty-dashboard.component.html'
})
export class FacultyDashboardComponent implements OnInit {

  activeTab: string = 'events';
  events: any[] = [];
  students: any[] = [];
  showModal = false;
  selectedEventId: string | null = null;

  form: FormGroup;
 getAuthHeaders() {
  return {
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token')
    }
  };
}


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: [''],
      description: [''],
      date: [''],
      venue: [''],
      capacity: ['']
    });
  }

  ngOnInit() {
    this.fetchMyEvents();
    console.log("Token:", sessionStorage.getItem("token"));

  }

  // ================= EVENTS =================

fetchMyEvents() {
  this.http.get<any[]>(
    'http://localhost:5000/api/faculty/my-events',
    this.getAuthHeaders()
  ).subscribe(res => this.events = res);
}


  // ================= CREATE / UPDATE =================

  createOrUpdateEvent() {

   const request = this.selectedEventId
  ? this.http.put(
      `http://localhost:5000/api/faculty/update/${this.selectedEventId}`,
      this.form.value,
      this.getAuthHeaders()
    )
  : this.http.post(
      'http://localhost:5000/api/faculty/create',
      this.form.value,
      this.getAuthHeaders()
    );


    request.subscribe(() => {

      alert(this.selectedEventId
        ? 'Event updated successfully'
        : 'Event sent for admin approval');

      this.form.reset();
      this.selectedEventId = null;
      this.fetchMyEvents();
      this.activeTab = 'events';
    });
  }

  // ================= VIEW STUDENTS =================

 viewStudents(id: string) {
  this.http.get<any[]>(
    `http://localhost:5000/api/faculty/students/${id}`,
    this.getAuthHeaders()
  ).subscribe(res => {
    this.students = res;
    this.showModal = true;
  });
}


  // ================= EDIT EVENT =================

  editEvent(event: any) {
    this.form.patchValue(event);
    this.selectedEventId = event._id;
    this.activeTab = 'create';
  }

  // ================= CSV DOWNLOAD =================

  downloadCSV() {

    let csv = 'Name\n';

    this.students.forEach(s => {
      csv += `${s.name}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'registered_students.csv';
    a.click();
  }

  // ================= STATUS BADGE =================

  statusBadge(status: string) {
    if (status === 'approved') return 'success';
    if (status === 'pending') return 'warning';
    return 'danger';
  }

  // ================= LOGOUT =================

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
