import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.interface';
import { AuthStoreService } from '../../services/auth-store.service';

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
  numberOfProductsInCart: number | null = null;

  @ViewChild('loginDialog') loginDialog!: LoginDialogComponent;

  constructor(private authStore: AuthStoreService, private router: Router) {}

  ngOnInit(): void {
    this.authStore.loggedUser$().subscribe(user => {
      this.user = user;
    });

    this.authStore.updateNumberOfProductsInCart();
    this.authStore.numberOfProductsInCart$().subscribe(products => {
      this.numberOfProductsInCart = products;
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
