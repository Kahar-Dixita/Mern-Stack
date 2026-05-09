import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {

  events: any[] = [];
  users: any[] = [];
  admin: any = null;

  activeTab = 'dashboard';
  search = '';
  userType = 'student';

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchProfile();
    this.fetchEvents();
  }

  fetchProfile() {
    this.adminService.getProfile().subscribe(res => this.admin = res);
  }

  fetchEvents() {
    this.adminService.getEvents().subscribe(res => this.events = res);
  }

  fetchUsers() {
    this.adminService.getUsers().subscribe(res => this.users = res);
  }

  approve(id: string) {
    this.adminService.approveEvent(id).subscribe(() => this.fetchEvents());
  }

  reject(id: string) {
    this.adminService.rejectEvent(id).subscribe(() => this.fetchEvents());
  }

  deleteUser(id: string) {
    if (!confirm('Delete this user?')) return;

    this.adminService.deleteUser(id).subscribe(() => this.fetchUsers());
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  setTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'users') this.fetchUsers();
  }

  // Filters
  get pendingEvents() {
    return this.events.filter(e => e.status === 'pending');
  }

  get approvedEvents() {
    return this.events.filter(e => e.status === 'approved');
  }

  get rejectedEvents() {
    return this.events.filter(e => e.status === 'rejected');
  }

  get filteredUsers() {
    return this.users
      .filter(u => u.role === this.userType)
      .filter(u =>
        u.name.toLowerCase().includes(this.search.toLowerCase()) ||
        u.email.toLowerCase().includes(this.search.toLowerCase())
      );
  }
}
