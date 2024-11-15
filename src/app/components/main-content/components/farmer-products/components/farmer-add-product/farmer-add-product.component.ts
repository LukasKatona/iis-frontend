import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../../../../models/product.interface';
import { Unit } from '../../../../../../../models/unit.enum';
import { FormsModule } from '@angular/forms';
import { createEmptyProduct } from '../../../../../../../models/product.interface';
import { ProductCategory } from '../../../../../../../models/product-category.interface';

@Component({
  selector: 'app-farmer-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './farmer-add-product.component.html',
  styleUrls: ['./farmer-add-product.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FarmerAddProductComponent {
  public product?: Product;
  public unit = Unit;
  public isProductCreated: boolean = false;
  public isDeleting: boolean = false;

  public categoriesForDropdown: ProductCategory[] = [];
  public categoryDropdownValue: string = '';


  @Output() productUpdated = new EventEmitter<Product>();

  constructor() {
    this.initProduct(); 
    this.fetchCategoriesForDropdown();
  }

  private initProduct() {
    this.product = createEmptyProduct(1);
    this.categoryDropdownValue = '';
  }

  private fetchCategoriesForDropdown() {
    let url = environment.baseUri + '/product-categories';
    fetch(url)
      .then(response => response.json())
      .then((data: ProductCategory[]) => {
        this.categoriesForDropdown = data;
      });
  }

  public onCategoryClicked(category: ProductCategory): void {
    this.categoryDropdownValue = category.name; 
    this.createProduct('categoryId', { target: { value: category.id } });
  }

  public createProduct(field: string, event: any) {
    if (this.product) {
      (this.product as any)[field] = event.target ? event.target.value : event;
    }
  }

  public setProductForEditing(product: Product) {
    this.product = { ...product };
    this.categoryDropdownValue = this.categoriesForDropdown.find(c => c.id === product.categoryId)?.name || '';
  }

  public saveProduct() {
    this.isProductCreated = true;
    const isNewProduct = !this.product?.id;
    console.log('Product to save:', isNewProduct);
    const url = environment.baseUri + '/products' + (isNewProduct ? '' : '/' + this.product?.id);
    const method = isNewProduct ? 'POST' : 'PATCH';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.product),
    })
      .then((response) => response.json())
      .then((updatedProduct) => {
        this.isProductCreated = false;
        this.productUpdated.emit(updatedProduct);

        this.initProduct();
      })
      .catch((error) => {
        console.error('Error creating/updating product:', error);
        this.isProductCreated = false;
      });
  }
}
