import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Product } from '../../../../../models/product.interface';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './components/product-card/product-card.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  public products: Product[] = [];

  ngOnInit(): void {
    this.getProducts();
  }

  private getProducts() {
    fetch(environment.baseUri + '/products')
      .then(response => response.json())
      .then(data => {
        this.products = data;
      });
  }
}
