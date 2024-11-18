import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../../../../models/product.interface';
import { Unit } from '../../../../../../../models/unit.enum';
import { FormsModule } from '@angular/forms';
import { createEmptyProduct } from '../../../../../../../models/product.interface';
import { ProductCategory } from '../../../../../../../models/product-category.interface';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../../../../../models/user.interface';
import { AuthStoreService } from '../../../../../../services/auth-store.service';

@Component({
  selector: 'app-farmer-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './farmer-add-product.component.html',
  styleUrls: ['./farmer-add-product.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FarmerAddProductComponent implements OnInit {
  public product?: Product;
  public unit = Unit;
  public isProductLoading: boolean = false;

  public categoriesForDropdown: ProductCategory[] = [];
  public categoryDropdownValue: string = '';

  public isFormValid: boolean = false;

  user: User | null = null;

  @Output() productUpdated = new EventEmitter<Product>();

  constructor(private http: HttpClient, private authStore: AuthStoreService) {}

  ngOnInit(): void {
    this.authStore.loggedUser$().subscribe(user => {
      this.user = user;
      this.initProduct(); 
      this.fetchCategoriesForDropdown();
    });
  }

  private validateProduct(): boolean {
    if (this.product?.name) {
      return true;
    }
    return false;
  }

  private initProduct() {
    if (this.user) this.product = createEmptyProduct(this.user?.id);
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
      this.isFormValid = this.validateProduct();
    }
  }

  public setProductForEditing(product: Product) {
    this.product = { ...product };
    this.categoryDropdownValue = this.categoriesForDropdown.find(c => c.id === product.categoryId)?.name || '';
    this.isFormValid = this.validateProduct();
  }

  public saveProduct() {
    this.isProductLoading = true;
    if (!this.product?.id) {
      this.http.post<Product>(environment.baseUri + '/products', this.product).subscribe(
        (createdProduct: Product) => {
          this.product = createdProduct;
          this.afterSaveProduct();
        }
      );
    } else {
      this.http.patch<Product>(environment.baseUri + '/products/' + this.product?.id, this.product).subscribe(
        (updatedProduct: Product) => {
          this.product = updatedProduct;
          this.afterSaveProduct();
        }
      );
    }
  }

  private afterSaveProduct() {
    this.isProductLoading = false;
    this.isFormValid = false;
    this.productUpdated.emit(this.product);
    this.initProduct();
  }
}
