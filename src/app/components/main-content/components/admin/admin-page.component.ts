import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserCardComponent } from './components/admin-user-card/admin-user-card.component';
import { User } from '../../../../../models/user.interface';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthStoreService } from '../../../../services/auth-store.service';
import { AdminUserFormComponent } from './components/admin-user-form/admin-user-form.component';
import { V } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, AdminUserCardComponent, AdminUserFormComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminPageComponent {
  public users: User[] = [];
  public currentUser: User | null = null;
  public isUserEditFormVisible = false;
  @ViewChild('editUserForm') editUserForm!: AdminUserFormComponent;

  constructor(private authStore: AuthStoreService, private url: HttpClient) { }

  onEditUser(user: User): void {
    this.isUserEditFormVisible = true; // Make the form visible
    setTimeout(() => {
      // Ensure the form is initialized before setting the user
      if (this.editUserForm) {
        this.editUserForm.setUserForEditing(user);
      } else {
        console.warn('Admin user form is not yet initialized.');
      }
    });
  }

  public refreshUserList(): void {
    this.url.get<User[]>(`${environment.baseUri}/users`).subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => console.error('Failed to fetch users:', err),
    });
  }

  onUserUpdated(updatedUser: User | undefined): void {
    if (!updatedUser) {
      console.warn('User is undefined.');
      this.refreshUserList();
    } else {
      const index = this.users.findIndex((u) => u.id === updatedUser.id);
      if (index !== -1) {
        this.users[index] = updatedUser;
      } else {
        this.users.push(updatedUser);
      }
    }
  }


  onFormClosed(): void {
    this.isUserEditFormVisible = false;
  }

  onFormOpened(): void {
    this.isUserEditFormVisible = true;
  }

  ngOnInit(): void {
    this.authStore.loggedUser$().subscribe(user => {
      this.currentUser = user;
      if (!user || user.isAdmin) {
        return;
      }
    });
    this.getUsers();
  }

  private getUsers(): void {
    let url = environment.baseUri + '/users';
    this.url.get<User[]>(url).subscribe((data: User[]) => {
      this.users = data;
    });
  }

  public createUser(): void {
    this.isUserEditFormVisible = true;
    setTimeout(() => {
      if (this.editUserForm) {
        this.editUserForm.setUserForCreating();
      } else {
        console.warn('Admin user form is not yet initialized.');
      }
    });
  }

}
