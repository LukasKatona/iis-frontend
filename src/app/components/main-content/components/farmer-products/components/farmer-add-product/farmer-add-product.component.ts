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
import { Atribute } from '../../../../../../../models/atribute.interface';
import { ProductAtribute } from '../../../../../../../models/product-atribute.interface';

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

  public categoryAtributes: Atribute[] = [];
  public productAtributes: ProductAtribute[] = [];


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
    if (!this.product?.name) {
      return false;
    }

    if (this.productAtributes.length > 0) {
      return this.validateProductAtributes();
    }

    return true;
  }

  private validateProductAtributes(): boolean {
    for (let atribute of this.productAtributes) {
      let categoryAtribute = this.categoryAtributes.find(ca => ca.name === atribute.name);
      
      if (!categoryAtribute) {
        return false;
      }

      if (categoryAtribute.isRequired && !atribute.value) {
        return false;
      }

      if (categoryAtribute.type === 'number' && isNaN(atribute.value as number)) {
        return false;
      }

      if (categoryAtribute.type === 'boolean' && (typeof atribute.value !== 'boolean' && atribute.value !== null)) {
        return false;
      }
    }

    return true;
  }

  private initProduct() {
    if (this.user?.id){
      this.product = createEmptyProduct(this.user.id); 
    }
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
    if (this.categoryDropdownValue == category.name) {
      this.categoryAtributes = [];
      this.productAtributes = [];
      this.categoryDropdownValue = '';
      this.updateProduct('categoryId', { target: { value: null } });
    } else {
      this.categoryAtributes = JSON.parse(category.atributes || '[]');
      this.productAtributes = category.atributes ? this.categoryAtributes.map(a => ({ name: a.name, value: null })) : [];
      this.categoryDropdownValue = category.name;
      this.updateProduct('categoryId', { target: { value: category.id } });
    }
  }

  public updateProduct(field: string, event: any) {
    if (this.product) {
      this.product[field] = event.target.value;
    }
    this.isFormValid = this.validateProduct();
  }

  public setProductForEditing(product: Product) {
    this.product = { ...product };
    this.categoryDropdownValue = this.categoriesForDropdown.find(c => c.id === product.categoryId)?.name || '';
    this.productAtributes = JSON.parse(product.categoryAtributes || '[]');
    this.categoryAtributes = JSON.parse(this.categoriesForDropdown.find(c => c.id === product.categoryId)?.atributes || '[]');
    this.isFormValid = this.validateProduct();
  }

  public saveProduct() {
    this.isProductLoading = true;

    if (this.product) {
      if (this.productAtributes.length > 0) {
        this.product.categoryAtributes = JSON.stringify(this.productAtributes);
      } else {
        this.product.categoryAtributes = '';
      }
    }
    
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
    this.categoryAtributes = [];
    this.productAtributes = [];
    this.productUpdated.emit(this.product);
    this.initProduct();
  }

  public changeProductAtributeValue(atribute: ProductAtribute, event: any, fieldType: string) {
    if (fieldType === 'boolean') {
      atribute.value = event.target.checked;
    } else if (fieldType === 'number') {
      atribute.value = parseFloat(event.target.value);
    } else {
      atribute.value = event.target.value;
    }
    this.isFormValid = this.validateProduct();
  }
}
