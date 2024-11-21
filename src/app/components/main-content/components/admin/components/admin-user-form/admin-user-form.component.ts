import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, EventEmitter, Output } from '@angular/core';
import { User } from '../../../../../../../models/user.interface';
import { environment } from '../../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthStoreService } from '../../../../../../services/auth-store.service';
import { CommonModule } from '@angular/common';
import { Farmer, createEmptyFarmer } from '../../../../../../../models/farmer.interface';
import { createEmptyUser } from '../../../../../../../models/user.interface';

@Component({
  selector: 'app-admin-user-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-user-form.component.html',
  styleUrl: './admin-user-form.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminUserFormComponent {
  public user?: User;
  public farmer?: Farmer;

  public isPersonalInfoLoading = false;
  public isFarmerInfoLoading = false;
  public isAddFarmerLoading = false;
  public isCreatingNewUser = false;

  public isPersonalInfoValid = true;
  public isFarmerInfoValid = true;
  currentUser: User | null = null;


  @Output() userUpdated = new EventEmitter<User>();
  @Output() formClosed = new EventEmitter<void>();

  constructor(private http: HttpClient, private authStore: AuthStoreService) { }

  ngOnInit(): void {
    this.authStore.loggedUser$().subscribe(user => {
      if (user != null) {
        this.user = user;
        this.isPersonalInfoValid = this.validatePersonalInfo();
      }
    });
    this.initForm();
  }

  onFormClosed(): void {
    this.formClosed.emit();
  }

  public changeUser(field: string, event: any) {
    if (this.user) {
      this.user[field] = event.target.value || '';
    }
    this.isPersonalInfoValid = this.validatePersonalInfo();
  }

  private initForm(): void {
    this.user = undefined;
    this.farmer = undefined;
    this.isCreatingNewUser = false;
  }

  setUserForEditing(user: User | null): void {
    this.isCreatingNewUser = false;
    if (user) {
      this.user = user;
      this.fetchFarmer();
    } else {
      this.initForm();
    }
  }

  setUserForCreating(): void {
    console.log('setUserForCreating');
    this.isCreatingNewUser = true;
    this.user = createEmptyUser();
    this.farmer = undefined;
  }

  private fetchFarmer(): void {
    if (this.user?.farmerId) {
      this.http
        .get<Farmer>(`${environment.baseUri}/farmers/${this.user.farmerId}`)
        .subscribe((data: Farmer) => {
          this.farmer = data;
        });
    }
  }

  public savePersonalInfo(): void {
    if (!this.user) return;

    this.isPersonalInfoLoading = true;

    if (this.isCreatingNewUser) {
      this.http.post<User>(`${environment.baseUri}/users`, this.user).subscribe(
        (data: User) => {
          this.isPersonalInfoLoading = false;
          this.user = data;
          this.userUpdated.emit(data); 
          this.isCreatingNewUser = false; 
        });
    } else {
      this.http.patch<User>(`${environment.baseUri}/users/${this.user.id}`, this.user).subscribe(
        (data: User) => {
          this.isPersonalInfoLoading = false;
          this.user = data;
          this.userUpdated.emit(data); 
        });
    }
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
    this.isAddFarmerLoading = true;
    this.http.post<Farmer>(environment.baseUri + '/farmers', createEmptyFarmer(this.user?.id || 0)).subscribe((data: Farmer) => {
      this.isAddFarmerLoading = false;
      this.farmer = data;

      if (this.user) {
        this.user.farmerId = this.farmer.id;
        this.user.isFarmer = true;
        this.savePersonalInfo();
      }
    });
  }

  public createUser() { //TODO ??
    this.isPersonalInfoLoading = true;
    this.http.post<User>(environment.baseUri + '/users', createEmptyUser()).subscribe((data: User) => {
      this.isPersonalInfoLoading = false;
      this.user = data;
      this.userUpdated.emit(data);
    });
  }
}
