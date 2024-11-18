import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, ViewChild } from '@angular/core';
import { Product } from '../../../../../../../models/product.interface';
import { environment } from '../../../../../../../environments/environment';
import { Farmer } from '../../../../../../../models/farmer.interface';
import { HttpClient } from '@angular/common/http';
import { AuthStoreService } from '../../../../../../services/auth-store.service';
import { User } from '../../../../../../../models/user.interface';

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
  amoutToBuy = 0;
  user: User | null = null;


  constructor(private authStore: AuthStoreService, private http: HttpClient) { }

  ngOnInit(): void {
    this.authStore.loggedUser$().subscribe(user => {
      this.user = user;
      if (!this.user) {
        return;
      }
    });
  }
  addToCart() {
    const url = `${environment.baseUri}/orders/add-product?user_id=${this.user?.id}&product_id=${this.product.id}&quantity=${this.amoutToBuy}`;
    const body = {
      user_id: this.user?.id,
      product_id: this.product.id,
      quantity: this.amoutToBuy,
    };
    this.http.post(url, body).subscribe(
      (data: any) => {
        console.log('Product added to cart:', data);
      }
    );
  }

  incrementAmount() {
    this.amount++;
    if (this.amount > 0 && this.amount < this.product.stock) {
      this.amoutToBuy = this.amount;
    }
  }

  onAmountChange(event: any) {
    this.amount = event.target.value;
    if (this.amount > 0 && this.amount < this.product.stock) {
      this.amoutToBuy = this.amount;
    }
  }

  decrementAmount() {
    this.amount--;
    if (this.amount > 0 && this.amount < this.product.stock) {
      this.amoutToBuy = this.amount;
    }
  }

}
