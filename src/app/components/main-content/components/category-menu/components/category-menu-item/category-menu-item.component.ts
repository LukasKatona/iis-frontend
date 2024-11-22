import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ProductCategory } from '../../../../../../../models/product-category.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-menu-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-menu-item.component.html',
  styleUrl: './category-menu-item.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoryMenuItemComponent {

  @Input() category!: ProductCategory;

  public getCategoryLink(category: ProductCategory): string {
    return "/shop/" + category.name.replace(/\s/g, '_').toLowerCase();
  }
}
