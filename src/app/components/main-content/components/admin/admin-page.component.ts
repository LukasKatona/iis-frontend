import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserCardComponent } from './components/admin-user-card/admin-user-card.component';
import { User } from '../../../../../models/user.interface';
import { environment } from '../../../../../environments/environment';
import { Role } from '../../../../../models/role.enum';
import { HttpClient } from '@angular/common/http';
import { AuthStoreService } from '../../../../services/auth-store.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, AdminUserCardComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminPageComponent {
  public users: User[] = [];
  user: User | null = null;



  constructor(private authStore: AuthStoreService, private url: HttpClient) {}

  ngOnInit(): void {
    this.authStore.loggedUser$().subscribe(user => {
      this.user = user;
      if (!user || user.isAdmin) {
        return;
      }});
    this.getUsers();
  }

  private getUsers(): void {
    let url = environment.baseUri + '/users';
    console.log('Fetching users from:', url);
    this.url.get<User[]>(url).subscribe((data: User[]) => {
      this.users = data;
    });
  }

}
