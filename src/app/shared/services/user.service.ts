import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  User = 'USER';

  constructor(private router: Router) {}

  addUser(name: string) {
    const user: User = {
      id: uuidv4(),
      name: name
    };
    localStorage.setItem(this.User, JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem(this.User) || '{}') as User;
  }

  deleteUserAccount() {
    localStorage.clear();
    this.router.navigateByUrl('sign-up');
  }

  isLoggedIn() {
    return Object.keys(this.getUser()).length > 0;
  }
}
