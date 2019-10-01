import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user: User;
  constructor() {
    this.user = new User();
   }
}
