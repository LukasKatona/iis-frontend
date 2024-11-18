import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createEmptyLogin, Login } from '../../../../../models/login.interface';
import { environment } from '../../../../../environments/environment';
import { Token } from '../../../../../models/token.interface';
import { AuthStoreService } from '../../../../services/auth-store.service';
import { User } from '../../../../../models/user.interface';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginDialogComponent {

  public isDialogOpen: boolean = false;

  public login?: Login;

  public isLoginLoading: boolean = false;

  public isFormValid: boolean = false;

  public loginError: string = '';

  constructor(
    private authStore: AuthStoreService,
    private http: HttpClient
  ) {}

  public open(): void {
    this.login = createEmptyLogin();
    this.isDialogOpen = true;
    this.isFormValid = false;
    this.loginError = '';
  }

  public close(): void {
    this.isDialogOpen = false;
  }

  public changeLogin(field: string, event: any): void {
    if (this.login) {
      this.login[field] = event.target.value;
    }
    this.isFormValid = this.validateLogin();
  }

  private validateLogin(): boolean {
    if (this.login) {
      return this.login.username.length > 0 && this.login.password.length > 0;
    }
    return false;
  }

  public confirmLogin(): void {
    this.isLoginLoading = true;
    let url = environment.baseUri + '/token';

    this.http.post<Token>(
      url,
      new URLSearchParams({
      'username': this.login?.username || '',
      'password': this.login?.password || ''
    }),
    {
      headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    ).subscribe({
      next: (data: Token) => {
      this.authStore.updateToken(data.access_token);
      const userUrl = environment.baseUri + '/users/me';
      
      this.http.get<User>(userUrl).subscribe((data: User) => {
        this.authStore.updateUserData(data);
        this.isLoginLoading = false;
        this.close();
      });
      },
      error: (error) => {
      if (error.status === 401) {
        this.loginError = 'Invalid username or password';
      }
      this.isLoginLoading = false;
      }
    });
  }
}
