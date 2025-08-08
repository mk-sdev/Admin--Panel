import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <input
        type="email"
        [(ngModel)]="email"
        name="email"
        placeholder="Email"
        required
      />
      <input
        type="password"
        [(ngModel)]="password"
        name="password"
        placeholder="Hasło"
        required
      />
      <button type="submit">Login</button>
    </form>
  `,
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.email && this.password) {
      this.auth.login(this.email, this.password).subscribe({
        next: () => {
          console.log('Login success');
          this.router.navigate(['/home']);
        },
        error: (err) => console.error('Login failed', err),
      });
    }
  }
}
