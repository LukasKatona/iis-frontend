import { Component, Input, OnChanges, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { User } from '../../../../../../../models/user.interface';
import { CommonModule } from '@angular/common';
import { Role } from '../../../../../../../models/role.enum';
import { U } from '@angular/cdk/keycodes';
import { environment } from '../../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-admin-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-user-card.component.html',
  styleUrl: './admin-user-card.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminUserCardComponent {
  @Input() user!: User;

  constructor(private http: HttpClient) {}

  toggleModerator() {
    this.user.isModerator = !this.user.isModerator; 
    const url = `${environment.baseUri}/users/${this.user.id}`;

    this.http.patch(url, this.user).subscribe({});
  }

  toggleAdmin() {
    this.user.isAdmin = !this.user.isAdmin; 
    const url = `${environment.baseUri}/users/${this.user.id}`;

    this.http.patch(url, this.user).subscribe({});
  }

  toggleActive() {
    this.user.isActive = !this.user.isActive; 
    const url = `${environment.baseUri}/users/${this.user.id}`;

    this.http.patch(url, this.user).subscribe({});
  }
} 
