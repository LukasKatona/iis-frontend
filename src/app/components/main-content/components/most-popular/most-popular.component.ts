import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Product } from '../../../../../models/product.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-most-popular',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './most-popular.component.html',
  styleUrl: './most-popular.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MostPopularComponent {
  public products: Product[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getMostPopularProducts();
  }

  private getMostPopularProducts(): void {
    let url = environment.baseUri + '/products/most-popular';

    this.http.get<Product[]>(url)
      .subscribe((data: Product[]) => {
        this.products = data;
      });
  }
}
