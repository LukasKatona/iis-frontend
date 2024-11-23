import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { createEmptyProductCategory, ProductCategory } from '../../../../../../models/product-category.interface';
import { createEmptyNewCategoryRequest, NewCategoryRequest } from '../../../../../../models/new-category-request.interface';
import { environment } from '../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { CategoryRequestCardComponent } from './components/category-request-card/category-request-card.component';
import { HttpClient } from '@angular/common/http';
import { AuthStoreService } from '../../../../../services/auth-store.service';
import { User } from '../../../../../../models/user.interface';
import { Atribute, createEmptyAtribute } from '../../../../../../models/atribute.interface';
import { CategoryCardComponent } from './components/category-card/category-card.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, CategoryRequestCardComponent, CategoryCardComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoriesComponent implements OnInit {
  user: User | null = null;

  public newCategoryRequest?: NewCategoryRequest;

  public categoryToEdit?: ProductCategory;

  public categoryToEditAtributes: Atribute[] = []
  public categoryRequestAtributes: Atribute[] = []

  public isCreateRequestLoading: boolean = false;
  public isEditCategoryLoading: boolean = false;

  public newCategoryRequests: NewCategoryRequest[] = [];

  public categories: ProductCategory[] = [];
  public newCategoryRequestParentCategoryDropdownValue: string = '';
  public categoryToEditParentCategoryDropdownValue: string = '';

  public isNewCategoryRequestValid: boolean = false;
  public isCategoryToEditValid: boolean = false;

  constructor(private http: HttpClient, private authStore: AuthStoreService) {}

  ngOnInit(): void {
    this.authStore.loggedUser$().subscribe(user => {
      if (user != null) {
        this.user = user;
        if (this.user?.id) {
          this.newCategoryRequest = createEmptyNewCategoryRequest(this.user?.id);
        }
        this.categoryToEdit = createEmptyProductCategory();
        this.fetchNewCategoryRequests();
        this.fetchCategoriesForDropdown();
      }
    });
  }

  private fetchNewCategoryRequests() {
    let url = environment.baseUri + '/category-requests/';
    this.http.get<NewCategoryRequest[]>(url).subscribe((data: NewCategoryRequest[]) => {
      this.newCategoryRequests = data;
    });
  }

  private fetchCategoriesForDropdown() {
    let url = environment.baseUri + '/product-categories';
    this.http.get<ProductCategory[]>(url).subscribe((data: ProductCategory[]) => {
      this.categories = data;
    });
  }

  public changeNewCategoryRequest(field: string, event: any) {
    if (this.newCategoryRequest) {
      if (field === 'parentCategoryId') {
        this.newCategoryRequestParentCategoryDropdownValue = this.categories.find((category: ProductCategory) => category.id === event.target.value)?.name || '';
      }
      this.newCategoryRequest[field] = event.target.value;
      this.isNewCategoryRequestValid = this.validateNewCategoryRequest();
    }
  }

  private validateNewCategoryRequest(): boolean {
    if (!this.newCategoryRequest?.newCategoryName) {
      return false;
    }

    for (const atribute of this.categoryRequestAtributes) {
      if (!atribute.name || !atribute.type) {
        return false;
      }
    }

    return true;
  }

  public createRequest() {
    this.isCreateRequestLoading = true;
    let url = environment.baseUri + '/category-requests/';
    if (this.newCategoryRequest && this.categoryRequestAtributes.length > 0) this.newCategoryRequest.atributes = JSON.stringify(this.categoryRequestAtributes);
    this.http.post(url, this.newCategoryRequest).subscribe(() => {
      this.isCreateRequestLoading = false;
      this.newCategoryRequestParentCategoryDropdownValue = '';
      this.isNewCategoryRequestValid = false;
      this.categoryRequestAtributes = [];
      this.fetchNewCategoryRequests();
      if (this.user?.id) this.newCategoryRequest = createEmptyNewCategoryRequest(this.user?.id);
    });
  }

  public getParentCategoryName(id: number | null | undefined): string {
    return this.categories.find((category: ProductCategory) => category.id === id)?.name || '';
  }

  public createNewAtributeForNewCategoryRequest() {
    this.isNewCategoryRequestValid = false;
    this.categoryRequestAtributes.push(createEmptyAtribute());
  }

  public createNewAtributeForCategoryToEdit() {
    this.isCategoryToEditValid = false;
    this.categoryToEditAtributes.push(createEmptyAtribute());
  }

  public deleteAtributeForNewCategoryRequest(atribute: Atribute) {
    this.categoryRequestAtributes = this.categoryRequestAtributes.filter(a => a !== atribute);
    this.isNewCategoryRequestValid = this.validateNewCategoryRequest();
  }

  public deleteAtributeForCategoryToEdit(atribute: Atribute) {
    this.categoryToEditAtributes = this.categoryToEditAtributes.filter(a => a !== atribute);
    this.isCategoryToEditValid = this.validateCategoryToEdit();
  }

  public changeNewCategoryRequestAtribute(atribute: Atribute, field: string, event: any) {
    this.changeAtribute(atribute, field, event);
    this.isNewCategoryRequestValid = this.validateNewCategoryRequest();
  }

  public changeCategoryToEditAtribute(atribute: Atribute, field: string, event: any) {
    this.changeAtribute(atribute, field, event);
    this.isCategoryToEditValid = this.validateCategoryToEdit();
  }

  private changeAtribute(atribute: Atribute, field: string, event: any) {
    if (field === 'isRequired') {
      atribute[field] = event.target.checked;
    } else {
      atribute[field] = event.target.value;
    }
    this.isNewCategoryRequestValid = this.validateNewCategoryRequest();
  }

  public removeCategoryFromList(category: ProductCategory) {
    this.categories = this.categories.filter(c => c !== category);
  }

  public fetchCategoryToEditor(category: ProductCategory) {
    this.categoryToEdit = category;
    if (category.atributes) {
      this.categoryToEditAtributes = JSON.parse(category.atributes);
    }
    this.categoryToEditParentCategoryDropdownValue = this.getParentCategoryName(category.parentCategoryId);
    this.isCategoryToEditValid = this.validateCategoryToEdit();
  }

  public changeCategoryToEdit(field: string, event: any) {
    if (this.categoryToEdit) {
      if (field === 'parentCategoryId') {
        this.categoryToEditParentCategoryDropdownValue = this.categories.find((category: ProductCategory) => category.id === event.target.value)?.name || '';
      }
      this.categoryToEdit[field] = event.target.value;
      this.isCategoryToEditValid = this.validateCategoryToEdit();
    }
  }

  private validateCategoryToEdit(): boolean {
    if (!this.categoryToEdit?.name) {
      return false;
     
    }

    for (const atribute of this.categoryToEditAtributes) {
      if (!atribute.name || !atribute.type) {
        return false;
      
      }
    }

    return true;
  }

  public saveCategory() {
    if(this.categoryToEdit?.id) {
      let url = environment.baseUri + '/product-categories/' + this.categoryToEdit.id;
      if (this.categoryToEditAtributes.length > 0) {
        this.categoryToEdit.atributes = JSON.stringify(this.categoryToEditAtributes);
      } else {
        this.categoryToEdit.atributes = "";
      }
      this.isEditCategoryLoading = true;

      this.http.patch(url, this.categoryToEdit).subscribe({
        next: () => {
          this.afterCategorySave();
        },
        error: (err) => {
          this.isEditCategoryLoading = false;
        }
      });
    } else {
      let url = environment.baseUri + '/product-categories';
      if (this.categoryToEditAtributes.length > 0 && this.categoryToEdit) this.categoryToEdit.atributes = JSON.stringify(this.categoryToEditAtributes);
      this.isEditCategoryLoading = true;

      this.http.post(url, this.categoryToEdit).subscribe({
        next: () => {
          this.afterCategorySave();
        },
        error: (err) => {
          this.isEditCategoryLoading = false;
        }
      });
    }
  }

  private afterCategorySave() {
    this.categoryToEditParentCategoryDropdownValue = '';
    this.isCategoryToEditValid = false;
    this.isEditCategoryLoading = false;
    this.categoryToEditAtributes = [];
    this.fetchCategoriesForDropdown();
    this.categoryToEdit = createEmptyProductCategory();
  }
}
