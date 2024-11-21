import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ProductCategory } from '../../../../../../models/product-category.interface';
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

  public categoryRequestAtributes: Atribute[] = []

  public isCreateRequestLoading: boolean = false;

  public newCategoryRequests: NewCategoryRequest[] = [];

  public categories: ProductCategory[] = [];
  public categoryDropdownValue: string = '';

  public isFormValid: boolean = false;

  constructor(private http: HttpClient, private authStore: AuthStoreService) {}

  ngOnInit(): void {
    this.authStore.loggedUser$().subscribe(user => {
      if(user != null) {
        this.user = user;
        this.newCategoryRequest = createEmptyNewCategoryRequest(this.user?.id);
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
        this.categoryDropdownValue = this.categories.find((category: ProductCategory) => category.id === event.target.value)?.name || '';
      }
      this.newCategoryRequest[field] = event.target.value;
      this.isFormValid = this.validateNewCategoryRequest();
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
      this.categoryDropdownValue = '';
      this.isFormValid = false;
      this.fetchNewCategoryRequests();
      if (this.user) this.newCategoryRequest = createEmptyNewCategoryRequest(this.user?.id);
    });
  }

  public getParentCategoryName(id: number | null | undefined): string {
    return this.categories.find((category: ProductCategory) => category.id === id)?.name || '';
  }

  public createNewAtribute() {
    this.isFormValid = false;
    this.categoryRequestAtributes.push(createEmptyAtribute());
  }
  public deleteAtribute(atribute: Atribute) {
    this.categoryRequestAtributes = this.categoryRequestAtributes.filter(a => a !== atribute);
  }

  public changeAtribute(atribute: Atribute, field: string, event: any) {
    if (field === 'isRequired') {
      atribute[field] = event.target.checked;
    } else {
      atribute[field] = event.target.value;
    }
    this.isFormValid = this.validateNewCategoryRequest();
  }

  public removeCategoryFromList(category: ProductCategory) {
    this.categories = this.categories.filter(c => c !== category);
  }
}
