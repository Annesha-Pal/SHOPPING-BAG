import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, BehaviorSubject } from 'rxjs';
import { Auth } from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn$: any;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<Auth[]> {
    return this.http.get<Auth[]>('http://localhost:8080/api/users');
  }

  checkUserExists(email: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/users`);
  }

  loginUser(loginData: any): Observable<any> {
    return this.http.post('http://localhost:8080/api/loginstats', loginData);
  }

  getAdmins(): Observable<Auth[]> {
    return this.http.get<Auth[]>('http://localhost:8080/api/users');
  }
  // updateUser(user: Auth) {
  //   return this.http.put(`/api/users/${user.id}`, user);
  // }
  // 🔹 Create a user (POST)
  createUser(user: Auth): Observable<Auth> {
    return this.http.post<Auth>('http://localhost:8080/api/users', user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`'http://localhost:8080/api/users/${id}`, {
      responseType: 'text',
    });
  }
  getUserId(): number | null {
    // return Number(localStorage.getItem('userId')) || null;
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;

    try {
      const user = JSON.parse(userJson);
      return user.id ?? null;
    } catch {
      return null;
    }
  }

  getUserById(id: number): Observable<any> {
    return this.getUsers().pipe(
      map((users) => users.find((user) => user.id === id))
    );
  }

  getIdOfUser(userId: number): Observable<Auth> {
    return this.http.get<Auth>(`http://localhost:8080/api/users/${userId}`);
  }

  getCurrentUser(): Auth | null {
    const stored = localStorage.getItem('_login');
    return stored ? JSON.parse(stored) : null;
  }
  updateUser(userId: number, updatedData: Partial<Auth>): Observable<Auth> {
    return this.http.put<Auth>(
      `http://localhost:8080/api/users/${userId}`,
      updatedData
    );
  }
}
