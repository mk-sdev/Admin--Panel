import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  try {
    const loggedIn = await auth.isLoggedIn();
    if (loggedIn) {
      router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  } catch {
    router.navigate(['/home']);
    return false;
  }
};
