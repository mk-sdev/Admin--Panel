import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

//   if (!auth.isLoggedIn()) {
//     return true; // można wejść na login
//   }

  router.navigate(['/home']); // jeśli zalogowany → od razu na home
  return false;
};
