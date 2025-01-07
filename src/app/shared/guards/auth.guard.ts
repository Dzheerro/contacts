import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { UserService } from '../services/user.service';

export const AuthGuard: CanActivateFn = () => {
  const router: Router = inject(Router);
  const userService: UserService = inject(UserService);

  if (!userService.isLoggedIn()) {
    router.navigateByUrl('/sign-up');
    return false;
  }
  return true;
};
