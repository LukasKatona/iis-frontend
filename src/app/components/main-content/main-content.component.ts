import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CategoryMenuComponent } from './components/category-menu/category-menu.component';
import { MostPopularComponent } from './components/most-popular/most-popular.component';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, CategoryMenuComponent, ProductsComponent, RouterModule, MostPopularComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainContentComponent {

  public showShopTabMenu = false;
  public showProfileTabMenu = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    router.events.subscribe((val: any) => {
      if (val instanceof NavigationEnd) {
        if (val.url.includes('shop')) {
          this.showShopTabMenu = true;
          this.showProfileTabMenu = false;
        } else if (val.url.includes('profile')) {
          this.showShopTabMenu = false;
          this.showProfileTabMenu = true;
        }
      }
    });
  }

  routeToPage(page: string) {
    this.router.navigate([`${page}`]);
  }
}
