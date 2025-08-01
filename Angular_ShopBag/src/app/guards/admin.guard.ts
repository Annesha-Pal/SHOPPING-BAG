import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const role = sessionStorage.getItem('role')?.toUpperCase();

  if (role === 'ADMIN') {
    return true;
  } else {
    return router.createUrlTree(['/home']);
  }
};
