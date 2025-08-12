import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

type SelectedUser = {
  _id: string;
  email: string;
  roles: string[];
  isVerified: boolean;
  provider: string;
} | null;
@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  apiUrl = 'http://localhost:3000';

  // display in the list
  userItems: { _id: string; email: string }[] = [];
  user: SelectedUser = null;

  logEmail(_id: string) {
    this.http
      .get<SelectedUser>(this.apiUrl + '/protected/user/id/' + _id, {
        withCredentials: true,
      })
      .subscribe((data) => {
        this.user = data;
      });
  }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.http
      .get<any[]>(this.apiUrl + '/protected/users', { withCredentials: true })
      .subscribe({
        next: (data) => {
          console.log('Users fetched successfully:', data);
          this.userItems = data;
        },
      });
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        console.log('Logout success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed', err);
      },
    });
  }
}
