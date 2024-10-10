import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Product } from '../../../../../models/product.interface';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private categoryId: number = 0;
  public categoryName: string = '';
  public products: Product[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.data['categoryId'];
    this.categoryName = this.route.snapshot.data['categoryName'];
    this.getProducts(undefined, this.categoryId, undefined, undefined);
  }

  private getProducts(nameFilter?: string, categoryIdFilter?: number, sortField?: string, sortDirection?: string): void {
    let url = environment.baseUri + '/products';

    const params = new URLSearchParams();

    if (nameFilter) {
      params.append('nameFilter', nameFilter);
    }
    if (categoryIdFilter) {
      params.append('categoryIdFilter', categoryIdFilter.toString());
    }
    if (sortField) {
      params.append('sortField', sortField.toString());
    }
    if (sortDirection) {
      params.append('sortDirection', sortDirection.toString());
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.products = data;
      });
  }
}
