import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { NewCategoryRequest } from '../../../../../../../../models/new-category-request.interface';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../../../environments/environment';
import { ProductCategory } from '../../../../../../../../models/product-category.interface';

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

  public changeCategoryRequestState(event: any) {
    this.categoryRequest.state = event.target.value;
    let url = environment.baseUri + '/category-requests/' + this.categoryRequest.id;
      fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.categoryRequest)
      });
    
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
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category),
    })
  }
}
