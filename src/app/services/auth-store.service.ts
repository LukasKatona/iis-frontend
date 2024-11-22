import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/user.interface';
import { AuthError } from '../../models/auth-error.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  private userSubject: BehaviorSubject<User | null>;
  private tokenSubject: BehaviorSubject<string | null>;
  private authErrorSubject: BehaviorSubject<AuthError | null>;

  private numberOfProductsInCartSubject: BehaviorSubject<number | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedAuthError = localStorage.getItem('authError');

    const storedNumberOfProductsInCart = localStorage.getItem('numberOfProductsInCart');

    this.userSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.tokenSubject = new BehaviorSubject<string | null>(storedToken);
    this.authErrorSubject = new BehaviorSubject<AuthError | null>(storedAuthError ? JSON.parse(storedAuthError) : null);

    this.numberOfProductsInCartSubject = new BehaviorSubject<number | null>(storedNumberOfProductsInCart ? JSON.parse(storedNumberOfProductsInCart) : null);
  }

  public loggedUser$(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  public token$(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  public authError$(): Observable<AuthError | null> {
    return this.authErrorSubject.asObservable();
  }

  public numberOfProductsInCart$(): Observable<number | null> {
    return this.numberOfProductsInCartSubject.asObservable();
  }

  public loggedUser(): User | null {
    return this.userSubject.value;
  }

  public token(): string | null {
    return this.tokenSubject.value;
  }

  public authError(): AuthError | null {
    return this.authErrorSubject.value;
  }

  public numberOfProductsInCart(): number | null {
    return this.numberOfProductsInCartSubject.value;
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

  public updateAuthError(authError: AuthError | null): void {
    this.authErrorSubject.next(authError);
    localStorage.setItem('authError', JSON.stringify(authError));
  }

  public updateNumberOfProductsInCart(): void {
    this.http.get<number>(environment.baseUri + "/orders/number-of-products").subscribe( (data) => {
      this.numberOfProductsInCartSubject.next(data);
    });
  }

  public clearAuthData(): void {
    this.userSubject.next(null);
    this.tokenSubject.next(null);
    this.authErrorSubject.next(null);
    this.numberOfProductsInCartSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('authError');
    localStorage.removeItem('numberOfProductsInCart');
  }
}
