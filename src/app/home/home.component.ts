import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { apiUrl } from '../app.config';
import { AuthService } from '../auth.service';

// TODOs:
// mark a user it it's you
// show user id in the list
// add input for searching user by email or id
// add error handling
// after editing a user it should be selected
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
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private apiService: ApiService
  ) {}

  // display in the list
  userItems: ListItem[] = [];
  user: SelectedUser = null;
  editMode = false;
  rolesList = Object.values(Roles);

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

  saveUser() {
    if (!this.user) return;
    const { _id, ...userWithoutId } = this.user;

    this.apiService
      .requestWithAuthRetry(
        'PUT',
        `${apiUrl}/protected/user/${_id}`,
        userWithoutId
      )
      .subscribe({
        next: (response) => {
          this.user = response.body as SelectedUser;
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

  showUser(_id: string, email?: string) {
    this.apiService
      .requestWithAuthRetry<SelectedUser>(
        'GET',
        _id
          ? `${apiUrl}/protected/user/id/${_id}`
          : `${apiUrl}/protected/user/email/${email}`
      )
      .subscribe({
        next: (response) => {
          this.user = response.body!;
        },
        error: (err) => {
          console.error('Failed to fetch user', err);
        },
      });
  }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.apiService
      .requestWithAuthRetry<ListItem[]>('GET', `${apiUrl}/protected/users`)
      .subscribe({
        next: (response) => {
          this.userItems = response.body as ListItem[];
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
