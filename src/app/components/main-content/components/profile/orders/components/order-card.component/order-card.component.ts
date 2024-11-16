import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { Order } from '../../../../../../../../models/order.interface';
import { environment } from '../../../../../../../../environments/environment';
import { CommonModule, formatDate } from '@angular/common';
import { Product } from '../../../../../../../../models/product.interface';
import { OrderStatus } from '../../../../../../../../models/order-status.enum';

@Component({
  selector: 'app-order-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderComponentComponent implements OnChanges {
  @Input() order!: Order;
  public products: Product[] = [];
  public createdAt: string = '';
  public status = OrderStatus;


  ngOnInit() {
    this.createdAt = formatDate(this.order.createdAt * 1000, 'dd.MM.yyyy', 'en-US');
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['order'] && this.order) {
      this.fetchProducts();
    }

  }

  private fetchProducts() {
    if (!this.order?.id) return;
    const url = `${environment.baseUri}/orders/${this.order.id}/products`;
    fetch(url)
      .then(response => response.json())
      .then((data: Product[]) => {
        this.products = data;
      })
      .catch(error => console.error('Error fetching products:', error));
  }

  getTotalPrice(): number {
    return this.products.reduce((total, product) => {
      return total + (product.unitPrice * product.stock); // Assuming stock is the quantity ordered
    }, 0);
  }

  changeOrderStatus(event: any) {
    this.order.status = event.target.value;  // The new status selected by the user
    console.log('Changing status to:', this.order.status);
    const url = environment.baseUri + '/orders/' + this.order.id + '/status';
    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.order)
    })
  }
  
}