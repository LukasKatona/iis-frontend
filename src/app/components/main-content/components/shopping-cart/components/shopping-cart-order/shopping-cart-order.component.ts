import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../../environments/environment';
import { Order } from '../../../../../../../models/order.interface';
import { Product } from '../../../../../../../models/product.interface';
import { OrderStatus } from '../../../../../../../models/order-status.enum';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shopping-cart-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shopping-cart-order.component.html',
  styleUrl: './shopping-cart-order.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShoppingCartOrderComponent {
  @Input() order!: Order;
  @Output() refreshOrders = new EventEmitter<void>();
  public products: Product[] = [];
  public createdAt: string = '';
  public status = OrderStatus;


  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.createdAt = formatDate(this.order.createdAt * 1000, 'dd.MM.yyyy', 'en-US');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['order'] && this.order) {
      this.fetchProducts();
    }
  }

  getProductTotalPrice(product: any): number {
    return parseFloat((product.unitPrice * product.stock).toFixed(2));
  }


  private fetchProducts() {
    if (!this.order?.id) return;
    const url = `${environment.baseUri}/orders/${this.order.id}/products`;
    this.http.get<Product[]>(url).subscribe({
      next: (data: Product[]) => {
        this.products = data;
      }
    });
  }

  getTotalPrice(): number {
    return parseFloat(
      this.products.reduce((total, product) => {
        return total + (product.unitPrice * product.stock);
      }, 0).toFixed(2)
    );
  }


  updateProductQuantity(product: Product, quantity: number) {
    console.log('updateProductQuantity', product, quantity);
    const url = `${environment.baseUri}/orders/${this.order.id}/edit-product`;

    if (quantity < 0) {  //TODO?
      alert('Quantity must be greater than zero.');
      return;
    }
    const payload = {
      productId: product.id,
      quantity: quantity
    };
    this.http.patch<Order>(url, payload, { headers: { 'Content-Type': 'application/json' } })
      .subscribe({
        next: (updatedOrder: Order) => {
          this.order = updatedOrder;
          this.fetchProducts();
        }
      });
  }

  deleteProduct(product: Product) {
    const url = `${environment.baseUri}/orders/${this.order.id}/product/${product.id}`;
    this.http.delete(url).subscribe(() => {
      this.products = this.products.filter(p => p.id !== product.id); // Remove deleted product from list
      this.refreshOrders.emit();
    });
  }

  deleteOrder() {
    const url = `${environment.baseUri}/orders/${this.order.id}`;
    this.http.delete(url).subscribe(() => {
      this.refreshOrders.emit();
    });
  }

  buyOrder() {
    this.order.status = OrderStatus.PENDING;
    const url = `${environment.baseUri}/orders/${this.order.id}/status`;
    this.http.patch(url, { status: this.order.status }, { headers: { 'Content-Type': 'application/json' } })
      .subscribe(() => {
        this.refreshOrders.emit();
      });
  }
}