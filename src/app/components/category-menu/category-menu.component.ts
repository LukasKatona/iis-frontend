import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../../models/product-category.interface';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-category-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-menu.component.html',
  styleUrl: './category-menu.component.scss'
})
export class CategoryMenuComponent implements OnInit {
  productCategories: ProductCategory[] = [];

  ngOnInit(): void {
    this.getProductCategories();
    console.log(this.productCategories);
  }

  private getProductCategories() {
    console.log(environment.baseUri)
    fetch(environment.baseUri + '/product-categories')
      .then(response => response.json())
      .then(data => this.productCategories = data);
  }

}
