import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { AuthError } from '../models/auth-error.interface';
import { AuthStoreService } from './services/auth-store.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainHeaderComponent, MainContentComponent, MainFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  public error: AuthError | null = null;

  constructor(private router: Router, private http: HttpClient, private authStore: AuthStoreService) {
    this.authStore.updateAuthError(null);
  }

  ngOnInit() {
    this.authStore.authError$().subscribe((error) => {
      this.error = error;
    });
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
      path: "shop/" + category.name.replace(/\s/g, '_').toLowerCase(),
      component: ProductsComponent,
      data: { categoryId: category.id, categoryName: category.name, atributes: category.atributes }
    }));

    this.router.resetConfig([...this.router.config, ...dynamicRoutes]);
  }
}
