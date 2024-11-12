import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { User } from '../../../../../../models/user.interface';
import { environment } from '../../../../../../environments/environment';
import { Farmer } from '../../../../../../models/farmer.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PersonalInfoComponent {
  public user?: User;
  public farmer?: Farmer;

  constructor() {
    this.fetchUser()
    this.fetchFarmer();
  }

  private fetchUser() {
    let url = environment.baseUri + '/users/' + 1;
 
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.user = data;
      });
  }

  private fetchFarmer() {
    let url = environment.baseUri + '/farmers/' + 1 + '/by-user-id';
    console.log(url);
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.farmer = data;
      });
  }
}
