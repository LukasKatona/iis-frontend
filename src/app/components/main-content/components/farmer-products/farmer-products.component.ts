import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { Farmer } from '../../../../../models/farmer.interface';
import { FarmerBannerComponent } from './components/farmer-banner/farmer-banner.component';
import { FarmerAddProductComponent } from './components/farmer-add-product/farmer-add-product.component';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { FarmerProductCardComponent } from './components/farmer-card-product/farmer-product-card/farmer-product-card.component';
import { Product } from '../../../../../models/product.interface';
import { AuthStoreService } from '../../../../services/auth-store.service';
import { User } from '../../../../../models/user.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-farmer-products',
  standalone: true,
  imports: [CommonModule, FarmerBannerComponent, FarmerAddProductComponent, FarmerProductCardComponent],
  templateUrl: './farmer-products.component.html',
  styleUrls: ['./farmer-products.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FarmerProductsComponent implements OnInit {
  public farmer: Farmer | undefined;
  public categoryName: string = '';
  public products: Product[] = [];
  @ViewChild('addProductForm') addProductForm!: FarmerAddProductComponent;

  private user: User | null = null;

  constructor(private authStore: AuthStoreService, private http: HttpClient) { }

  onEditProduct(product: Product) {
    if (this.addProductForm) {
      this.addProductForm.setProductForEditing(product);
    }
  }

  ngOnInit(): void {
    this.authStore.loggedUser$().subscribe(user => {
      this.user = user;
      if (!this.user || !this.user.isFarmer) {
        return;
      }
      if (this.user?.id) {
        this.getFarmerByUserId(this.user?.id);
      }
      if (this.user?.farmerId) {
        this.getProducts(this.user?.farmerId);
      }
    });
  }

  private refreshProducts(): void {
    if (!this.user || !this.user.isFarmer) {
      return;
    }
    if (this.user?.farmerId) {
      this.getProducts(this.user?.farmerId);
    }
  }

  onProductUpdated(updatedProduct: Product | undefined): void {
    if (!updatedProduct) {
      this.refreshProducts();
    }
    else {
      const index = this.products.findIndex((p) => p.id === updatedProduct.id);
      if (index !== -1) {
        this.products[index] = updatedProduct;
      } else {
        this.products.push(updatedProduct);
      }
    }
  }

  private getProducts(userId: number): void {
    const url = `${environment.baseUri}/products`;
    const params = new URLSearchParams();
    params.append('farmerIdFilter', userId.toString());

    this.http.get<Product[]>(`${url}?${params.toString()}`).subscribe(
      (data) => {
        this.products = data;
      }
    );
  }

  private getFarmerByUserId(userId: number): void {
    const url = `${environment.baseUri}/farmers/${userId}/by-user-id`;

    this.http.get<Farmer>(url).subscribe(
      (data) => {
        this.farmer = data;
      }
    );
  }
}
