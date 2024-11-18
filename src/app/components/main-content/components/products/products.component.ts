import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Product } from '../../../../../models/product.interface';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.data['categoryId'];
    this.categoryName = this.route.snapshot.data['categoryName'];
    this.getProducts(undefined, this.categoryId, undefined, undefined);
  }

  private getProducts(nameFilter?: string, categoryIdFilter?: number, sortField?: string, sortDirection?: string): void {
    let url = environment.baseUri + '/products';

    const params: any = {};

    if (nameFilter) {
      params.nameFilter = nameFilter;
    }
    if (categoryIdFilter) {
      params.categoryIdFilter = categoryIdFilter;
    }
    if (sortField) {
      params.sortField = sortField;
    }
    if (sortDirection) {
      params.sortDirection = sortDirection;
    }

    this.http.get<Product[]>(url, { params })
      .subscribe((data: Product[]) => {
        this.products = data;
      });
  }
}
