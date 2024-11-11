import { Component } from '@angular/core';
import { ProductCategory } from '../../../../../models/product-category.interface';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-menu.component.html',
  styleUrl: './category-menu.component.scss'
})
export class CategoryMenuComponent {
  menuTree: ProductCategory[] = [];

  constructor() {
    this.getProductCategories();
  }

  private getProductCategories() {
    fetch(environment.baseUri + '/product-categories')
      .then(response => response.json())
      .then(data => {
      });
  }
}
