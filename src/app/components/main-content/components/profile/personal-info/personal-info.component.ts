import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { User } from '../../../../../../models/user.interface';
import { environment } from '../../../../../../environments/environment';
import { Farmer, createEmptyFarmer } from '../../../../../../models/farmer.interface';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthStoreService } from '../../../../../services/auth-store.service';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PersonalInfoComponent implements OnInit {
  private userId = 3;

  public user?: User;
  public farmer?: Farmer;

  public isPersonalInfoLoading = false;
  public isFarmerInfoLoading = false;

  constructor(private http: HttpClient, private authStore: AuthStoreService) {
    this.fetchFarmer();
  }

  ngOnInit(): void {
    this.authStore.loggedUser$().subscribe(user => {
      if(user != null) {
        this.user = user;
        this.fetchFarmer();
      }
    });
  }

  private fetchFarmer() {
    let url = environment.baseUri + '/farmers/' + this.user?.id + '/by-user-id';
    this.http.get<Farmer>(url).subscribe((data: Farmer) => {
      if (data !== null) {
      this.farmer = data;
      } else {
      this.farmer = createEmptyFarmer(this.userId);
      }
    });
  }

  public savePersonalInfo() {
    this.isPersonalInfoLoading = true;
    this.http.patch<User>(environment.baseUri + '/users/' + this.user?.id, this.user).subscribe((data: User) => {
      this.isPersonalInfoLoading = false;
      this.user = data;
      this.authStore.updateUserData(data);
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
      this.http.patch<Farmer>(environment.baseUri + '/farmers/' + this.farmer?.id, this.farmer).subscribe((data: Farmer) => {
        this.isFarmerInfoLoading = false;
        this.farmer = data;
      });
    } else {
      this.http.post<Farmer>(environment.baseUri + '/farmers', this.farmer).subscribe((data: Farmer) => {
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
