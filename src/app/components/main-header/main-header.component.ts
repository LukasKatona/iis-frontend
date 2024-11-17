import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { Dialog } from 'mdui';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.interface';
import { AuthStoreService } from '../../services/auth-store.service';
import { Role } from '../../../models/role.enum';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [CommonModule, RouterLink, LoginDialogComponent],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainHeaderComponent implements OnInit {

  user: User | null = null;
  showAdminToolsButton: boolean = false;

  @ViewChild('loginDialog') loginDialog!: LoginDialogComponent;

  constructor(private authStore: AuthStoreService, private router: Router) {}

  ngOnInit(): void {
    this.authStore.loggedUser$().subscribe(user => {
      this.user = user;
      this.showAdminToolsButton = (user && user.role === Role.ADMIN) ? true : false;
    });
  }

  public openLoginDialog(): void {
    this.loginDialog.open();
  }

  public logOut(): void {
    this.router.navigate(['/']);
    this.authStore.clearAuthData();
  }
}
