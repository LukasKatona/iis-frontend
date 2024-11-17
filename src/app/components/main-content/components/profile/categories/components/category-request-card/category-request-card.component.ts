import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { NewCategoryRequest } from '../../../../../../../../models/new-category-request.interface';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../../../environments/environment';
import { ProductCategory } from '../../../../../../../../models/product-category.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-category-request-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-request-card.component.html',
  styleUrl: './category-request-card.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoryRequestCardComponent {

  @Input() categoryRequest!: NewCategoryRequest;
  @Input() parentCategoryName: string = '';

  constructor(private http: HttpClient) {}

  public changeCategoryRequestState(event: any) {
    this.categoryRequest.state = event.target.value;
    let url = environment.baseUri + '/category-requests/' + this.categoryRequest.id;
    this.http.patch(url, this.categoryRequest).subscribe();
    
    if (event.target.value === 'approved') {
      this.createNewCategory();
    }
  }

  public createNewCategory() {
    let url = environment.baseUri + '/product-categories/';
    const category: ProductCategory = {
      name: this.categoryRequest.newCategoryName,
      parentCategoryId: this.categoryRequest.parentCategoryId
    };
    this.http.post(url, category).subscribe();
  }
}
