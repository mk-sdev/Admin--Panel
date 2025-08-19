import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { ApiService } from '../api.service';
import { apiUrl } from '../app.config';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';

// TODOs:
// mark a user it it's you
// show user id in the list
// add input for searching user by email or id
// add error handling
// after editing a user it should be selected
// move some code to another service
//? what if changed email is someone's pending email?

type SelectedUser = {
  _id: string;
  email: string;
  roles: Roles[];
  isVerified: boolean;
  provider: string;
} | null;

type ListItem = { _id: string; email: string };

enum Roles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private http: HttpClient) {}

  // display in the list
  userItems: ListItem[] = [];
  user: SelectedUser = null;
  editMode = false;
  rolesList = Object.values(Roles);
  newPassword = '';

  changePassword() {
    if (!this.user || !this.newPassword) return;
    this.http
      .patch(`${apiUrl}/protected/user/${this.user._id}/password`, {
        password: this.newPassword,
      })
      .subscribe({
        next: () => {
          console.log('Password changed successfully');
          this.newPassword = '';
        },
        error: (err) => {
          console.error('Failed to change password', err);
        },
      });
  }

  trackByUserId(index: number, user: ListItem): string {
    return user._id;
  }

  searchQuery = '';
  findUser() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(this.searchQuery)) {
      this.showUser('', this.searchQuery);
    } else {
      this.showUser(this.searchQuery);
    }
  }

  logUserOut() {
    if (!this.user) return;
    this.http
      .patch(`${apiUrl}/protected/user/${this.user._id}/logout`, {})
      .subscribe(() => console.log('Logged out successfully'));
  }

  saveUser() {
    if (!this.user) return;
    const { _id, ...userWithoutId } = this.user;

    this.http.put(`${apiUrl}/protected/user/${_id}`, userWithoutId).subscribe({
      next: (user) => {
        this.user = user as SelectedUser;
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
      if (!this.user.roles.includes(role as Roles)) {
        this.user.roles.push(role as Roles);
      }
    } else {
      this.user.roles = this.user.roles.filter((r) => r !== role);
    }
  }

  error = '';

  showUser(_id: string, email?: string) {
    this.http
      .get<SelectedUser>(
        _id
          ? `${apiUrl}/protected/user/id/${_id}`
          : `${apiUrl}/protected/user/email/${email}`
      )
      .subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (err) => {
          this.error = 'Failed to fetch user';
          console.error('Failed to fetch user', err);
        },
      });
  }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.http.get<ListItem[]>(`${apiUrl}/protected/users`).subscribe({
      next: (users) => {
        this.userItems = users;
      },
    });
  }
}
