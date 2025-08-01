import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const role = sessionStorage.getItem('role')?.toUpperCase();

  if (role === 'ADMIN' || role === 'USER') {
    return true;
  } else {
    return router.createUrlTree(['/home']);
  }
};
