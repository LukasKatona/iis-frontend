import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../../environments/environment';
import { Order } from '../../../../../../../models/order.interface';
import { Product } from '../../../../../../../models/product.interface';
import { ProductWithQuantity } from '../../../../../../../models/product-with-quantity.interface';
import { OrderStatus } from '../../../../../../../models/order-status.enum';
import { HttpClient } from '@angular/common/http';
import { AuthStoreService } from '../../../../../../services/auth-store.service';

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
  public productsWithQuantity: ProductWithQuantity[] = [];
  public createdAt: string = '';
  public status = OrderStatus;


  constructor(private http: HttpClient, private authStore: AuthStoreService) { }

  ngOnInit() {
    this.createdAt = formatDate(this.order.createdAt * 1000, 'dd.MM.yyyy', 'en-US');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['order'] && this.order) {
      this.fetchProducts();
    }
  }

  getProductTotalPrice(product: any, quantity: number): number {
    return parseFloat((product.unitPrice * quantity).toFixed(2));
  }


  private fetchProducts() {
    if (!this.order?.id) return;
    const url = `${environment.baseUri}/orders/${this.order.id}/products`;
    this.http.get<ProductWithQuantity[]>(url).subscribe({
      next: (data: ProductWithQuantity[]) => {
        this.productsWithQuantity = data;
      }
    });
  }

  getTotalPrice(): number {
    return parseFloat(
      this.productsWithQuantity.reduce((total, productsWithQuantity) => {
        return total + (productsWithQuantity.product.unitPrice * productsWithQuantity.quantity);
      }, 0).toFixed(2)
    );
  }



  updateProductQuantity(product: ProductWithQuantity) {
    const quantity = product.quantity;
    const url = `${environment.baseUri}/orders/${this.order.id}/edit-product`;

    if (quantity < 0) { 
      alert('Quantity must be greater than zero.');
      return;
    }
    const payload = {
      productId: product.product.id,
      quantity: quantity
    };
    this.http.patch<Order>(url, payload, { headers: { 'Content-Type': 'application/json' } })
      .subscribe({
        next: (updatedOrder: Order) => {
          this.order = updatedOrder;
          this.fetchProducts();
          this.refreshOrders.emit();
        }
      });
  }

  deleteProduct(product: Product) {
    const url = `${environment.baseUri}/orders/${this.order.id}/product/${product.id}`;
    this.http.delete(url).subscribe(() => {
      this.products = this.products.filter(p => p.id !== product.id); // Remove deleted product from list
      this.refreshOrders.emit();
      this.authStore.updateNumberOfProductsInCart();
    });
  }

  deleteOrder() {
    const url = `${environment.baseUri}/orders/${this.order.id}`;
    this.http.delete(url).subscribe(() => {
      this.refreshOrders.emit();
      this.authStore.updateNumberOfProductsInCart();
    });
  }

  buyOrder() {
    this.order.status = OrderStatus.PENDING;
    const url = `${environment.baseUri}/orders/${this.order.id}/status`;
    this.http.patch(url, { status: this.order.status }, { headers: { 'Content-Type': 'application/json' } })
      .subscribe(() => {
        this.refreshOrders.emit();
        this.authStore.updateNumberOfProductsInCart();
      });
  }
}