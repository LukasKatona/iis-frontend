import { Component, Input, OnChanges, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { User } from '../../../../../../../models/user.interface';
import { CommonModule } from '@angular/common';
import { Role } from '../../../../../../../models/role.enum';
import { U } from '@angular/cdk/keycodes';
import { environment } from '../../../../../../../environments/environment';


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
  public role = Role;

  changeRole(event: any) {
    this.user.role = event.target.value;
    console.log('Changing role to:', this.user.role);
    const url = environment.baseUri + '/users/' + this.user.id + '/role';
    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.user)
    })
  }
}
