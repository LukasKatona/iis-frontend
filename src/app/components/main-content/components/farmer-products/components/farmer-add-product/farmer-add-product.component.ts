import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../../../../models/product.interface';
import { Unit } from '../../../../../../../models/unit.enum';
import { FormsModule } from '@angular/forms';
import { createEmptyProduct } from '../../../../../../../models/product.interface';
import { ProductCategory } from '../../../../../../../models/product-category.interface';
import { HttpClient } from '@angular/common/http';

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

  public categoriesForDropdown: ProductCategory[] = [];
  public categoryDropdownValue: string = '';


  @Output() productUpdated = new EventEmitter<Product>();

  constructor(private http: HttpClient) {
    this.initProduct(); 
    this.fetchCategoriesForDropdown();
  }

  private initProduct() {
    this.product = createEmptyProduct(1);
    this.categoryDropdownValue = '';
  }

  private fetchCategoriesForDropdown() {
    let url = environment.baseUri + '/product-categories';
    this.http.get<ProductCategory[]>(url).subscribe(
      (data: ProductCategory[]) => {
        this.categoriesForDropdown = data;
      }
    );
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
    const url = environment.baseUri + '/products' + (isNewProduct ? '' : '/' + this.product?.id);
    const method = isNewProduct ? 'POST' : 'PATCH';

    this.http.request<Product>(method, url, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: this.product,
    })
      .subscribe(
        (updatedProduct: Product) => {
          this.isProductCreated = false;
          this.productUpdated.emit(updatedProduct);
          this.initProduct();
        }
      );
  }
}
