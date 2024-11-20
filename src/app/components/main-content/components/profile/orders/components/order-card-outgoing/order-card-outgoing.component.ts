import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, SimpleChanges, EventEmitter, OnInit } from '@angular/core';
import { Order } from '../../../../../../../../models/order.interface';
import { environment } from '../../../../../../../../environments/environment';
import { CommonModule, formatDate } from '@angular/common';
import { Product } from '../../../../../../../../models/product.interface';
import { ProductWithQuantity } from '../../../../../../../../models/product-with-quantity.interface';
import { OrderStatus } from '../../../../../../../../models/order-status.enum';
import { HttpClient } from '@angular/common/http';
import { createEmptyReview, Review } from '../../../../../../../../models/review.interface';
import { AuthStoreService } from '../../../../../../../services/auth-store.service';
import { User } from '../../../../../../../../models/user.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-card-outgoing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-card-outgoing.component.html',
  styleUrl: './order-card-outgoing.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderCardOutgoingComponent implements OnInit, OnChanges {

  user: User | null = null;

  @Input() order!: Order;
  public productsWithQuantity: ProductWithQuantity[] = [];
  public createdAt: string = '';
  public updatedAt: string = '';

  public status = OrderStatus;

  constructor(private http: HttpClient, private authStore: AuthStoreService) {}

  ngOnInit(): void {
    this.authStore.loggedUser$().subscribe(user => {
      this.user = user;
    });
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
        for (const productWithQuantity of this.productsWithQuantity) {
          if (!productWithQuantity.review && this.user) {
            if (this.user?.id != null && this.order.id != null) {
              productWithQuantity.review = createEmptyReview(this.user.id, this.order.id, productWithQuantity.product.id ?? null);
            }
          }
        }
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

  updateProductRating(review: Review) {
    if (review.id) {
      const url = environment.baseUri + "/reviews/" + review.id;
      this.http.patch<Review>(url, review).subscribe((data: Review) => {
        this.updateProductWithNewReview(data);
      });
    } else {
      const url = environment.baseUri + "/reviews";
      this.http.post<Review>(url, review).subscribe((data: Review) => {
        this.updateProductWithNewReview(data);
      });
    }
  }

  private updateProductWithNewReview(review: Review) {
    let product = this.productsWithQuantity.find(p => p.product.id === review.productId);
    if (product) {
      product.review = review;
    }
  }
}
