import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  try {
    const loggedIn = await auth.isLoggedIn();
    if (loggedIn) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  } catch {
    router.navigate(['/login']);
    return false;
  }
};
