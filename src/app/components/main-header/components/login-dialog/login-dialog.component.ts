import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createEmptyLogin, Login } from '../../../../../models/login.interface';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginDialogComponent {

  public isDialogOpen: boolean = false;

  public login?: Login;

  public isLoginLoading: boolean = false;

  public open(): void {
    this.login = createEmptyLogin();
    this.isDialogOpen = true;
  }

  public close(): void {
    this.isDialogOpen = false;
  }

  public changeLogin(field: string, event: any): void {
    if (this.login) {
      this.login[field] = event.target.value;
    }
  }

  public confirmLogin(): void {
    this.isLoginLoading = true;
    let url = environment.baseUri + '/token';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'username': this.login?.username || '',
        'password': this.login?.password || ''
      })
    })
    .then(response => response.json())
    .then(() => {
      this.isLoginLoading = false;
      this.close();
    })
  }
}
