import { Injectable } from '@angular/core';

export interface User {
  id: string;
  login: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User = {login: '', token: '', id: ''};

  constructor() { }

  setUser(user: User) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
