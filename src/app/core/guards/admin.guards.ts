import { inject }       from '@angular/core';
import { Router }       from '@angular/router';
import { Auth }         from '@angular/fire/auth';
import { AdminService } from '../services/admin.service'; // ← remove the extra 's'

export const adminGuard = async () => {
  const auth         = inject(Auth);
  const adminService = inject(AdminService);  // ← instance, lowercase
  const router       = inject(Router);

  const user = auth.currentUser;

  if (!user) {
    router.navigate(['/auth']);
    return false;
  }

  const isAdmin = await adminService.isAdmin(user.uid); // ← use instance, not class

  if (!isAdmin) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
