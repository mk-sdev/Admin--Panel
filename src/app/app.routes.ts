import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { guestGuard } from './guest.guard';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [guestGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    //  canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'home' },
];
