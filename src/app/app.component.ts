import { Component } from '@angular/core';
import { MainContentComponent } from './components/main-content/main-content.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { MainFooterComponent } from './components/main-footer/main-footer.component';
import { ProductsComponent } from './components/main-content/components/products/products.component';
import { ProductCategory } from '../models/product-category.interface';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainHeaderComponent, MainContentComponent, MainFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private router: Router) {}

  ngOnInit() {
    this.getProductCategories();
    console.log(this.router);
  }

  private getProductCategories() {
    fetch(environment.baseUri + '/product-categories')
      .then(response => response.json())
      .then(data => {
        this.populateRoutes(data);
      });
  }

  private populateRoutes(categories: ProductCategory[]) {
    const dynamicRoutes = categories.map(category => ({
      path: category.name.toLowerCase(),
      component: ProductsComponent,
      data: { categoryId: category.id, categoryName: category.name }
    }));

    this.router.resetConfig([...this.router.config, ...dynamicRoutes]);
  }
}
