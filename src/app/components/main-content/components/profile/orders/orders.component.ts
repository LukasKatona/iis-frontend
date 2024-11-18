import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Order } from '../../../../../../models/order.interface';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../../../../models/user.interface';
import { AuthStoreService } from '../../../../../services/auth-store.service';
import { OrderCardIncomingComponent} from './components/order-card-incoming/order-card-incoming.component';
import { OrderCardOutgoingComponent} from './components/order-card-outgoing/order-card-outgoing.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, OrderCardIncomingComponent, OrderCardOutgoingComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrdersComponent {
  user: User | null = null;

  public ordersIncoming: Order[] = [];
  public ordersOutgoing: Order[] = [];

  constructor(private authStore: AuthStoreService, private http: HttpClient) { }

  ngOnInit(): void {
    this.authStore.loggedUser$().subscribe(user => {
      this.user = user;
      if (!this.user) {
        return;
      }
      this.fetchOrdersByUserId();
      this.fetchOrderByFarmId();
    }
    );
  }

  private fetchOrdersByUserId(): void {
    const url = `${environment.baseUri}/orders?user_id=${this.user?.id}&exclude_status=in_cart`;
    this.http.get<Order[]>(url).subscribe((data: Order[]) => {
      this.ordersOutgoing = data;
    });
  }

  private fetchOrderByFarmId(): void {
    const url = `${environment.baseUri}/orders?farmer_id=${this.user?.farmerId}&exclude_status=in_cart`;
    this.http.get<Order[]>(url).subscribe((data: Order[]) => {
      this.ordersIncoming = data;
    });
  }
}
