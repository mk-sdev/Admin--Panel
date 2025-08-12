import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { apiUrl } from '../app.config';

// TODOs:
// use api.service for all api calls
// optimize the list
// create Roles enum
// mark a user it it's you
// show user id in the list
// add input for searching user by email or id
// add error handling
// after editing a user it should be selected
//? what if changed email is someone's pending email?

type SelectedUser = {
  _id: string;
  email: string;
  roles: string[];
  isVerified: boolean;
  provider: string;
} | null;
@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  // display in the list
  userItems: { _id: string; email: string }[] = [];
  user: SelectedUser = null;
  editMode = false;
  rolesList = ['USER', 'ADMIN'];

  saveUser() {
    if (!this.user) return;
    const { _id, ...userWithoutId } = this.user;

    this.http
      .put<SelectedUser>(
        apiUrl + '/protected/user/' + this.user._id,
        userWithoutId,
        {
          withCredentials: true,
        }
      )
      .subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.editMode = false;
          console.log('User updated successfully');
        },
        error: (err) => {
          console.error('Failed to update user', err);
        },
      });
  }

  onRoleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const role = input.value;

    if (!this.user) return;

    if (input.checked) {
      if (!this.user.roles.includes(role)) {
        this.user.roles.push(role);
      }
    } else {
      this.user.roles = this.user.roles.filter((r) => r !== role);
    }
  }

  showUser(_id: string) {
    this.http
      .get<SelectedUser>(apiUrl + '/protected/user/id/' + _id, {
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
      .get<any[]>(apiUrl + '/protected/users', { withCredentials: true })
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
