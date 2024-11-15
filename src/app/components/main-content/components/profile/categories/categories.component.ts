import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createEmptyProductCategory, ProductCategory } from '../../../../../../models/product-category.interface';
import { createEmptyNewCategoryRequest, NewCategoryRequest } from '../../../../../../models/new-category-request.interface';
import { environment } from '../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { CategoryRequestCardComponent } from './components/category-request-card/category-request-card.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, CategoryRequestCardComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoriesComponent {
  userId = 1;

  public newCategoryRequest: NewCategoryRequest;
  public isCreateRequestLoading: boolean = false;

  public newCategoryRequests: NewCategoryRequest[] = [];

  public categoriesForDropdown: ProductCategory[] = [];
  public categoryDropdownValue: string = '';

  constructor() {
    this.newCategoryRequest = createEmptyNewCategoryRequest(this.userId);
    this.fetchNewCategoryRequests();
    this.fetchCategoriesForDropdown();
  }

  private fetchNewCategoryRequests() {
    let url = environment.baseUri + '/category-requests/';
    fetch(url)
      .then(response => response.json())
      .then((data: NewCategoryRequest[]) => {
        this.newCategoryRequests = data;
      });
  }

  private fetchCategoriesForDropdown() {
    let url = environment.baseUri + '/product-categories';
    fetch(url)
      .then(response => response.json())
      .then((data: ProductCategory[]) => {
        this.categoriesForDropdown = data;
      });
  }

  public changeNewCategoryRequest(field: string, event: any) {
    if (this.newCategoryRequest) {
      if (field === 'parentCategoryId') {
        this.categoryDropdownValue = this.categoriesForDropdown.find((category: ProductCategory) => category.id === event.target.value)?.name || '';
      }
      this.newCategoryRequest[field] = event.target.value;
    }
  }

  public createRequest() {
    this.isCreateRequestLoading = true;
    let url = environment.baseUri + '/category-requests/';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.newCategoryRequest)
    })
    .then(() => {
      this.isCreateRequestLoading = false;
      this.categoryDropdownValue = '';
      this.fetchNewCategoryRequests();
      this.newCategoryRequest = createEmptyNewCategoryRequest(this.userId);
    });
  }

  public getParentCategoryName(id: number | null | undefined): string {
    return this.categoriesForDropdown.find((category: ProductCategory) => category.id === id)?.name || '';
  }
}
