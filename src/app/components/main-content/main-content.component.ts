import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CategoryMenuComponent } from './components/category-menu/category-menu.component';
import { MostPopularComponent } from './components/most-popular/most-popular.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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

  constructor(private router: Router, private route: ActivatedRoute) {}

  routeToHomePage() {
    this.router.navigate([`/`]);
  }

  routeToFarmerPage() {
    this.router.navigate([`/farmer-products`]);
  }
}
