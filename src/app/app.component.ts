import { Component } from '@angular/core';
import { MainContentComponent } from './components/main-content/main-content.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { MainFooterComponent } from './components/main-footer/main-footer.component';
import { ProductsComponent } from './components/main-content/components/products/products.component';
import { ProductCategory } from '../models/product-category.interface';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import 'mdui/mdui.css';
import 'mdui';
import { setColorScheme } from 'mdui';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainHeaderComponent, MainContentComponent, MainFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    setColorScheme('#0D2216');
    this.getProductCategories();
  }

  private getProductCategories() {
    this.http.get<ProductCategory[]>(`${environment.baseUri}/product-categories`)
      .subscribe((data: ProductCategory[]) => {
        this.populateRoutes(data);
      });
  }

  private populateRoutes(categories: ProductCategory[]) {
    const dynamicRoutes = categories.map(category => ({
      path: "shop/" + category.name.toLowerCase(),
      component: ProductsComponent,
      data: { categoryId: category.id, categoryName: category.name }
    }));

    this.router.resetConfig([...this.router.config, ...dynamicRoutes]);
  }
}
