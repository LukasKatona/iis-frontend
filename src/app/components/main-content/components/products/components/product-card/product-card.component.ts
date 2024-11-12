import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, ViewChild } from '@angular/core';
import { Product } from '../../../../../../../models/product.interface';
import { environment } from '../../../../../../../environments/environment';
import { Farmer } from '../../../../../../../models/farmer.interface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductCardComponent {
  @Input()
  product!: Product;

  amount = 0;

  addToCart() {
    console.log('Product added to cart', this.product);
  }

  incrementAmount() {
    this.amount++;
    if (this.amount > 0 && this.amount < this.product.stock) {
      this.addToCart();
    }
  }

  onAmountChange(event: any) {
    this.amount = event.target.value;
    if (this.amount > 0 && this.amount < this.product.stock) {
      this.addToCart();
    }
  }

  decrementAmount() {
    this.amount--;
    if (this.amount > 0 && this.amount < this.product.stock) {
      this.addToCart();
    }
  }
}
