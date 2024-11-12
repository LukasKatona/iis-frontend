import { Component, OnInit, ViewChild } from '@angular/core';
import { Farmer } from '../../../../../models/farmer.interface';
import { FarmerBannerComponent } from './components/farmer-banner/farmer-banner.component';
import { FarmerAddProductComponent } from './components/farmer-add-product/farmer-add-product.component';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { FarmerProductCardComponent } from './components/farmer-card-product/farmer-product-card/farmer-product-card.component';
import { Product } from '../../../../../models/product.interface';

@Component({
  selector: 'app-farmer-products',
  standalone: true,
  imports: [CommonModule, FarmerBannerComponent, FarmerAddProductComponent, FarmerProductCardComponent],
  templateUrl: './farmer-products.component.html',
  styleUrls: ['./farmer-products.component.scss'],
  schemas: []
})
export class FarmerProductsComponent implements OnInit {
  public farmer: Farmer | undefined;
  private staticUserId: number = 1;
  private categoryId: number = 0;
  public categoryName: string = '';
  public products: Product[] = [];
  @ViewChild('addProductForm') addProductForm!: FarmerAddProductComponent;

  onEditProduct(product: Product) {
    if (this.addProductForm) {
      this.addProductForm.setProductForEditing(product);
    } else {
      console.warn('Add product form is not yet available');
    }
  }

  ngOnInit(): void {
    this.getFarmerByUserId(this.staticUserId);
    this.getProducts(this.staticUserId);
  }

  onProductUpdated(updatedProduct: Product) {
    const index = this.products.findIndex((p) => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct; 
    } else {
      this.products.push(updatedProduct);
    }
  }

  private getProducts(userId: number): void {
    let url = environment.baseUri + '/products';

    const params = new URLSearchParams();

    params.append('farmerIdFilter', userId.toString());

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.products = data;
      });
  }

  private getFarmerByUserId(userId: number): void {
  const url = environment.baseUri + '/farmers/' + userId + '/by-user-id';

  fetch(url)
      .then(response => response.json())
    .then((data: Farmer) => {
      this.farmer = data;
    });
}
}
