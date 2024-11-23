import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { Order } from '../../../../../../../../models/order.interface';
import { environment } from '../../../../../../../../environments/environment';
import { CommonModule, formatDate } from '@angular/common';
import { Product } from '../../../../../../../../models/product.interface';
import { ProductWithQuantity } from '../../../../../../../../models/product-with-quantity.interface';
import { OrderStatus } from '../../../../../../../../models/order-status.enum';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-card-incoming',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-card-incoming.component.html',
  styleUrl: './order-card-incoming.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderCardIncomingComponent {
  @Input() order!: Order;
  public productsWithQuantity: ProductWithQuantity[] = [];
  public products: Product[] = [];
  public createdAt: string = '';
  public updatedAt: string = '';
  public status = OrderStatus;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.createdAt = formatDate(this.order.createdAt * 1000, 'dd.MM.yyyy', 'en-US');
    if (this.order.updatedAt) {
      this.updatedAt = formatDate(this.order.updatedAt * 1000, 'HH:mm dd.MM.yyyy ', 'en-US');
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['order'] && this.order) {
      this.fetchProducts();
    }
  }

  private fetchProducts() {
    if (!this.order?.id) return;
    const url = `${environment.baseUri}/orders/${this.order.id}/products`;
    this.http.get<ProductWithQuantity[]>(url).subscribe(
      (data: ProductWithQuantity[]) => {
        this.productsWithQuantity = data;
      }
    );
  }

  getTotalPrice(): number {
    return parseFloat(
      this.productsWithQuantity.reduce((total, productWithQuantity) => {
        return total + (productWithQuantity.product.unitPrice * productWithQuantity.quantity);
      }, 0).toFixed(2)
    );
  }

  getProductTotalPrice(product: any, quantity: number): number {
    return parseFloat((product.unitPrice * quantity).toFixed(2));
  }

  changeOrderStatus(event: any) {
    this.order.status = event.target.value;
    const url = `${environment.baseUri}/orders/${this.order.id}/status`;
    this.http.patch(url, { status: this.order.status }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe({});
  }
}
