import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CategoryMenuComponent } from './components/category-menu/category-menu.component';
import { MostPopularComponent } from './components/most-popular/most-popular.component';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { CommonModule } from '@angular/common';
import { AuthStoreService } from '../../services/auth-store.service';
import { User } from '../../../models/user.interface';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, CategoryMenuComponent, ProductsComponent, RouterModule, MostPopularComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainContentComponent implements OnInit {

  public user: User | null = null;

  public showShopTabMenu = true;
  public showProfileTabMenu = false;

  public shopTabMenuValue = 'shop';
  public profileTabMenuValue = 'profile';

  constructor(private router: Router, private authStore: AuthStoreService) {
    router.events.subscribe((val: any) => {
      if (val instanceof NavigationEnd) {
        if (val.url.includes('shopping-cart')) {
          this.showShopTabMenu = false;
          this.showProfileTabMenu = false;
        } else if (val.url.includes('profile')) {
          this.showShopTabMenu = false;
          this.showProfileTabMenu = true;
          this.profileTabMenuValue = val.url.split('/')[2];
        } else if (val.url.includes('shop')) {
          this.showShopTabMenu = true;
          this.showProfileTabMenu = false;
          this.shopTabMenuValue = val.url.split('/')[2] == 'farmer-products' ? 'farmer-products' : 'products';
        } else {
          this.showShopTabMenu = false;
          this.showProfileTabMenu = false;
        }
      }
    });
  }

  ngOnInit(): void {
    this.authStore.loggedUser$().subscribe(user => {
      this.user = user;
    });
  }

  routeToPage(page: string) {
    this.router.navigate([`${page}`]);
  }
}
