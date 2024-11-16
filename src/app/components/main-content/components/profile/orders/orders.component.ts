import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OrderComponentComponent } from './components/order-card.component/order-card.component';
import { environment } from '../../../../../../environments/environment';
import { Order } from '../../../../../../models/order.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [OrderComponentComponent, CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrdersComponent {
  userId = 3;

  public orders: Order[] = [];

  constructor() {
    this.fetchOrdersByUserId();
  }

  private fetchOrdersByUserId(): void {
    const url = `${environment.baseUri}/orders?user_id=${this.userId}`; 
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
