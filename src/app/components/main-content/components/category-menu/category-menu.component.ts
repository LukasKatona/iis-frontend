import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProductCategory } from '../../../../../models/product-category.interface';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CategoryMenuItemComponent } from './components/category-menu-item/category-menu-item.component';

@Component({
  selector: 'app-category-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryMenuItemComponent],
  templateUrl: './category-menu.component.html',
  styleUrl: './category-menu.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoryMenuComponent {
  categoryTree: ProductCategory[] = [];

  constructor(private http: HttpClient) {
    this.getProductCategories();
  }

  private getProductCategories() {
    this.http.get<ProductCategory[]>(`${environment.baseUri}/product-categories`)
      .subscribe((data: ProductCategory[]) => {
        this.buildCategoryTree(data);
        const collapse = document.querySelector(".menu-collapse") as any;
        if (collapse != null) {
          collapse.value = [];
          data.forEach((category: ProductCategory) => {
          collapse.value.push(category.id);
          });
        }
      });
  }

  private buildCategoryTree(categories: ProductCategory[]) {
    const categoryMap = new Map<number, ProductCategory>();
    categories.forEach(category => categoryMap.set(category.id ?? 0, category));

    categories.forEach(category => {
      if (category.parentCategoryId != null) {
        const parent = categoryMap.get(category.parentCategoryId);
        if (parent != null) {
          if (parent.children == null) {
            parent.children = [];
          }
          parent.children.push(category);
        }
      } else {
        this.categoryTree.push(category);
      }
    });
  }

  public getCategoryLink(category: ProductCategory): string {
    return "/shop/" + category.name.replace(/\s/g, '_').toLowerCase();
  }
}
