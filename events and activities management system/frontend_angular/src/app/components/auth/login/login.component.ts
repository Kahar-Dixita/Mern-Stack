import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  login() {
    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {

        sessionStorage.setItem('token', res.token);

        if (res.role === 'student') this.router.navigate(['/student']);
        if (res.role === 'faculty') this.router.navigate(['/faculty']);
        if (res.role === 'admin') this.router.navigate(['/admin']);
      },

      error: (err) => {
        alert(err.error?.message || 'Login failed');
      }
    });
  }
}
