import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { User } from '../../../../../../models/user.interface';
import { environment } from '../../../../../../environments/environment';
import { Farmer, createEmptyFarmer } from '../../../../../../models/farmer.interface';
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
  private userId = 3;

  public user?: User;
  public farmer?: Farmer;

  public isPersonalInfoLoading = false;
  public isFarmerInfoLoading = false;

  constructor() {
    this.fetchUser()
    this.fetchFarmer();
  }

  private fetchUser() {
    let url = environment.baseUri + '/users/' + this.userId;
 
    fetch(url)
      .then(response => response.json())
      .then((data: User) => {
        this.user = data;
      });
  }

  private fetchFarmer() {
    let url = environment.baseUri + '/farmers/' + this.userId + '/by-user-id';
    fetch(url)
      .then(response => response.json())
      .then((data: Farmer) => {
        if (data !== null) {
          this.farmer = data;
        } else {
          this.farmer = createEmptyFarmer(this.userId);
        }
      });
  }

  public savePersonalInfo() {
    this.isPersonalInfoLoading = true;
    fetch(environment.baseUri + '/users/' + this.user?.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.user)
    })
    .then(response => response.json())
    .then((data: User) => {
      this.isPersonalInfoLoading = false;
      this.user = data;
    });
  }

  public changeUser(field: string, event: any) {
    if (this.user) {
      this.user[field] = event.target.value;
    }
  }

  public saveFarmerInfo() {
    this.isFarmerInfoLoading = true;
    if (this.farmer?.id) {
      fetch(environment.baseUri + '/farmers/' + this.farmer?.id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.farmer)
      })
      .then(response => response.json())
      .then((data: Farmer) => {
        this.isFarmerInfoLoading = false;
        this.farmer = data;
      });
    } else {
      fetch(environment.baseUri + '/farmers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.farmer)
      })
      .then(response => response.json())
      .then((data: Farmer) => {
        this.isFarmerInfoLoading = false;
        this.farmer = data;
      });
    }
  }

  public changeFarmer(field: string, event: any) {
    if (this.farmer) {
      this.farmer[field] = event.target.value;
    }
  }
}
