import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  private userSubject: BehaviorSubject<User | null>;
  private tokenSubject: BehaviorSubject<string | null>;

  constructor() {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    this.userSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.tokenSubject = new BehaviorSubject<string | null>(storedToken);
  }

  public loggedUser$(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  public loggedUser(): User | null {
    return this.userSubject.value;
  }

  public token(): string | null {
    return this.tokenSubject.value;
  }

  public updateAuthData(user: User | null, token: string | null): void {
    this.userSubject.next(user);
    this.tokenSubject.next(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token || '');
  }

  public updateToken(token: string | null): void {
    this.tokenSubject.next(token);
    localStorage.setItem('token', token || '');
  }

  public updateUserData(user: User | null): void {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  public clearAuthData(): void {
    this.userSubject.next(null);
    this.tokenSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}
