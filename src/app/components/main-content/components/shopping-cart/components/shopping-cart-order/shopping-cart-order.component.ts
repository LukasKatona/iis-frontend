import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, SimpleChanges, EventEmitter } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../../environments/environment';
import { Order } from '../../../../../../../models/order.interface';
import { Product } from '../../../../../../../models/product.interface';
import { OrderStatus } from '../../../../../../../models/order-status.enum';

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

  getProductTotalPrice(product: any): number {
    return product.unitPrice * product.stock;
  }

  private fetchProducts() {
    if (!this.order?.id) return;
    const url = `${environment.baseUri}/orders/${this.order.id}/products`;
    fetch(url)
      .then(response => response.json())
      .then((data: Product[]) => {
        this.products = data;
      })
  }

  getTotalPrice(): number {
    return this.products.reduce((total, product) => {
      return total + (product.unitPrice * product.stock);
    }, 0);
  }

  updateProductQuantity(product: Product, quantity: number) {
      console.log('updateProductQuantity', product, quantity);
      const url = `${environment.baseUri}/orders/${this.order.id}/edit-product`;
  
      if (quantity <= 0) {
          alert('Quantity must be greater than zero.');
          return;
      }
      const payload = {
          productId: product.id,
          quantity: quantity
      };
      fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload) 
      })
      .then(response => {
          return response.json();
      })
      .then(updatedOrder => {
          this.order = updatedOrder;  
          this.fetchProducts();  
      })
  }
  
  
  deleteProduct(product: Product) {
    const url = `${environment.baseUri}/orders/${this.order.id}/product/${product.id}`;
    fetch(url, {
      method: 'DELETE'
    })
    .then(() => {
      this.products = this.products.filter(p => p.id !== product.id); // Remove deleted product from list
    })
    .catch(error => console.error('Error deleting product:', error));
  }

  deleteOrder() {
    const url = `${environment.baseUri}/orders/${this.order.id}`;
    fetch(url, {
      method: 'DELETE'
    })
  }

  buyOrder() {
    this.order.status = OrderStatus.PENDING;
    const url = `${environment.baseUri}/orders/${this.order.id}/status`;
    fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: this.order.status })
    })
  }
}