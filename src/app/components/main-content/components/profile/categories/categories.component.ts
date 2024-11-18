import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ProductCategory } from '../../../../../../models/product-category.interface';
import { createEmptyNewCategoryRequest, NewCategoryRequest } from '../../../../../../models/new-category-request.interface';
import { environment } from '../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { CategoryRequestCardComponent } from './components/category-request-card/category-request-card.component';
import { HttpClient } from '@angular/common/http';
import { AuthStoreService } from '../../../../../services/auth-store.service';
import { User } from '../../../../../../models/user.interface';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, CategoryRequestCardComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoriesComponent implements OnInit {
  user: User | null = null;

  public newCategoryRequest?: NewCategoryRequest;
  public isCreateRequestLoading: boolean = false;

  public newCategoryRequests: NewCategoryRequest[] = [];

  public categoriesForDropdown: ProductCategory[] = [];
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
      this.categoriesForDropdown = data;
    });
  }

  public changeNewCategoryRequest(field: string, event: any) {
    if (this.newCategoryRequest) {
      if (field === 'parentCategoryId') {
        this.categoryDropdownValue = this.categoriesForDropdown.find((category: ProductCategory) => category.id === event.target.value)?.name || '';
      }
      this.newCategoryRequest[field] = event.target.value;
      this.isFormValid = this.validateNewCategoryRequest();
    }
  }

  private validateNewCategoryRequest(): boolean {
    if (this.newCategoryRequest?.newCategoryName) {
      return true;
    }
    return false;
  }

  public createRequest() {
    this.isCreateRequestLoading = true;
    let url = environment.baseUri + '/category-requests/';
    this.http.post(url, this.newCategoryRequest).subscribe(() => {
      this.isCreateRequestLoading = false;
      this.categoryDropdownValue = '';
      this.isFormValid = false;
      this.fetchNewCategoryRequests();
      if (this.user) this.newCategoryRequest = createEmptyNewCategoryRequest(this.user?.id);
    });
  }

  public getParentCategoryName(id: number | null | undefined): string {
    return this.categoriesForDropdown.find((category: ProductCategory) => category.id === id)?.name || '';
  }
}
