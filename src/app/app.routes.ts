import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: 'sign-up', loadComponent: () => import('./shared/components/signup/signup.component').then((c) => c.SignupComponent) },
  {
    path: 'contacts',
    loadComponent: () => import('./shared/components/contacts/contacts.component').then((c) => c.ContactsComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'contacts' }
];
