import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { Dialog } from 'mdui';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [CommonModule, RouterLink, LoginDialogComponent],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainHeaderComponent {

  @ViewChild('loginDialog') loginDialog!: LoginDialogComponent;

  public openLoginDialog(): void {
    this.loginDialog.open();
  }
}
