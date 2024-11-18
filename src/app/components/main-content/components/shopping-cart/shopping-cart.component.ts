import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { Order } from '../../../../../models/order.interface';
import { ShoppingCartOrderComponent } from './components/shopping-cart-order/shopping-cart-order.component';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, ShoppingCartOrderComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShoppingCartComponent {
  userId = 3;

  public orders: Order[] = [];

  constructor() {
    this.fetchOrdersByUserId();
  }

  private fetchOrdersByUserId(): void {
    const url = `${environment.baseUri}/orders?user_id=${this.userId}&status=in_cart`;
    
    fetch(url)
      .then(response => response.json())
      .then((data: Order[]) => {
        this.orders = data;
      })
      .catch(error => {
        console.error('Error fetching orders for user:', error);
      });
  }

}
