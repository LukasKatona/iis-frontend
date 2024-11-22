import { Component, Input,CUSTOM_ELEMENTS_SCHEMA, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Farmer } from '../../../../../../../models/farmer.interface';
import { User } from '../../../../../../../models/user.interface';
import { environment } from '../../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-farmer-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './farmer-banner.component.html',
  styleUrl: './farmer-banner.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FarmerBannerComponent {
  @Input() farmer!: Farmer;
  public user: User | undefined;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getFarmerInfo(this.farmer.userId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['farmer'] && changes['farmer'].currentValue) {
      this.getFarmerInfo(changes['farmer'].currentValue.userId);
    }
  }

  public getFarmerInfo(userId: number): void {
    this.http.get<User>(`${environment.baseUri}/users/${userId}`).subscribe((data: User) => {
      this.user = data;
    });
  }
}
