import { Component, OnInit } from '@angular/core';
import { Farmer } from '../../../../../models/farmer.interface';
import { FarmerBannerComponent } from './components/farmer-banner/farmer-banner.component';
import { FarmerAddProductComponent } from './components/farmer-add-product/farmer-add-product.component';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-farmer-products',
  standalone: true,
  imports: [CommonModule, FarmerBannerComponent, FarmerAddProductComponent],
  templateUrl: './farmer-products.component.html',
  styleUrls: ['./farmer-products.component.scss']
})
export class FarmerProductsComponent implements OnInit {
  public farmer: Farmer | undefined;
  private staticUserId: number = 1;

  ngOnInit(): void {
    this.getFarmerByUserId(this.staticUserId);
  }

  private getFarmerByUserId(userId: number): void {
    const url = environment.baseUri + '/farmers/' + userId + '/by-user-id';

    fetch(url)
      .then(response => response.json())
      .then((data: Farmer) => {
        this.farmer = data;
      });
  }
}
