import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private firstNameSubject = new BehaviorSubject<string | null>(null);
  firstName$ = this.firstNameSubject.asObservable();

  constructor() {
    this.checkSession();
  }
  login(firstName: string) {
    sessionStorage.setItem('firstName', firstName);
    this.isLoggedInSubject.next(true);
    this.firstNameSubject.next(firstName);
  }

  logout() {
    sessionStorage.removeItem('firstName');
    this.isLoggedInSubject.next(false);
    this.firstNameSubject.next(null);
  }

  checkSession() {
    const firstName = sessionStorage.getItem('firstName');
    if (firstName) {
      this.isLoggedInSubject.next(true);
      this.firstNameSubject.next(firstName);
    }
  }
}
