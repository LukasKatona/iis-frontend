import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createEmptyLogin, Login } from '../../../../../models/login.interface';
import { createEmptyRegister, Register } from '../../../../../models/register.interface';
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
  public isRegisterMode: boolean = false;
  public register: Register = createEmptyRegister();
  public isLoginLoading: boolean = false;
  public isFormValid: boolean = false;

  constructor(private authStore: AuthStoreService, private http: HttpClient) { }

  public open(): void {
    this.register = createEmptyRegister();
    this.isDialogOpen = true;
    this.isFormValid = false;
    this.isRegisterMode = false;
  }

  public close(): void {
    this.isDialogOpen = false;
  }

  public toggleRegisterMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.validateForm();
  }

  public changeRegister(field: string, event: any): void {
    if (this.register) {
      this.register[field] = event.target.value;
    }
    this.validateForm();
  }

  private validateForm(): void {
    if (this.register) {
      this.isFormValid = this.register.password.length > 0 &&
        (!this.isRegisterMode ||
          (this.register.name.length > 0 &&
            this.register.surname.length > 0 &&
            this.register.email.length > 0));

      if (!this.isRegisterMode) {
        this.isFormValid = this.isFormValid && this.register.username?.length > 0;
      }
    }
  }


  public confirmLogin(): void {
    this.isLoginLoading = true;
    const url = environment.baseUri + '/token';

    this.http
      .post<Token>(
        url,
        new URLSearchParams({
          username: this.register.username || '',
          password: this.register.password || '',
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      )
      .subscribe({
        next: (data: Token) => {
          this.authStore.updateToken(data.access_token);
          const userUrl = environment.baseUri + '/users/me';

          this.http.get<User>(userUrl).subscribe({
            next: (data: User) => {
              this.authStore.updateUserData(data);
              this.isLoginLoading = false;
              this.close();
            },
            error: () => {
              this.isLoginLoading = false;
            },
          });
        },
        error: () => {
          this.isLoginLoading = false;
        },
      });
  }

  public confirmRegister(): void {
    this.isLoginLoading = true;
    const url = environment.baseUri + '/users';

    this.http.post<User>(url, this.register).subscribe({
      next: (data: User) => {
        this.register.username = data.email;
        this.confirmLogin();
      },
      error: () => {
        this.isLoginLoading = false;
      },
    });
  }


}
