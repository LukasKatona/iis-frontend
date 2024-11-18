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
  public user?: User;
  public farmer?: Farmer;

  public isPersonalInfoLoading = false;
  public isFarmerInfoLoading = false;
  public isAddFarmerLoading = false;

  public isPersonalInfoValid = true;
  public isFarmerInfoValid = true;

  constructor(private http: HttpClient, private authStore: AuthStoreService) {}

  ngOnInit(): void {
    this.authStore.loggedUser$().subscribe(user => {
      if(user != null) {
        this.user = user;
        this.isPersonalInfoValid = this.validatePersonalInfo();
        if (this.user.isFarmer) {
          this.fetchFarmer();
        }
      }
    });
  }

  private fetchFarmer() {
    let url = environment.baseUri + '/farmers/' + this.user?.id + '/by-user-id';
    this.http.get<Farmer>(url).subscribe((data: Farmer) => {
      this.farmer = data;
    });
    this.isFarmerInfoValid = this.validateFarmerInfo();
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
    this.isPersonalInfoValid = this.validatePersonalInfo();
  }

  private validatePersonalInfo(): boolean {
    if (this.user?.name && this.user?.email && this.user?.phone) {
      return true;
    }
    return false;
  }

  public saveFarmerInfo() {
    this.isFarmerInfoLoading = true;
    this.http.patch<Farmer>(environment.baseUri + '/farmers/' + this.farmer?.id, this.farmer).subscribe((data: Farmer) => {
      this.isFarmerInfoLoading = false;
      this.farmer = data;
    });
  }

  public changeFarmer(field: string, event: any) {
    if (this.farmer) {
      this.farmer[field] = event.target.value;
    }
    this.isFarmerInfoValid = this.validateFarmerInfo();
  }

  private validateFarmerInfo(): boolean {
    if (
      this.farmer?.farmName &&
      this.farmer?.CIN &&
      this.farmer?.VATIN &&
      this.farmer?.VAT &&
      this.farmer?.bankCode &&
      this.farmer?.accountNumber
    ) {
      return true;
    }
    return false;
  }

  public addFarmer() {
    if (!this.user) {
      return;
    }
    this.isAddFarmerLoading = true;
    this.farmer = createEmptyFarmer(this.user?.id);
    this.http.post<Farmer>(environment.baseUri + '/farmers', this.farmer).subscribe((data: Farmer) => {
      this.isAddFarmerLoading = false;
      this.farmer = data;

      if (this.user) {
        this.user.farmerId = this.farmer.id;
        this.user.isFarmer = true;
        this.savePersonalInfo();
      }
    });
  }
}
