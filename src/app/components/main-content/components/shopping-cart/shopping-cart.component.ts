import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { Order } from '../../../../../models/order.interface';
import { ShoppingCartOrderComponent } from './components/shopping-cart-order/shopping-cart-order.component';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../../../models/user.interface';
import { AuthStoreService } from '../../../../services/auth-store.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, ShoppingCartOrderComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShoppingCartComponent {
  user: User | null = null;


  public orders: Order[] = [];

  constructor(private authStore: AuthStoreService, private http: HttpClient) { }

  ngOnInit(): void {
    this.authStore.loggedUser$().subscribe(user => {
      this.user = user;
      if (!this.user) {
        return;
      }
      this.fetchOrdersByUserId();
    }
    );
  }

  private fetchOrdersByUserId(): void {
    const url = `${environment.baseUri}/orders?user_id=${this.user?.id}&status=in_cart`;

    this.http.get<Order[]>(url).subscribe(
      (data: Order[]) => {
        this.orders = data;
      }
    );
  }

}
