import { Component, Input,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Farmer } from '../../../../../../../models/farmer.interface';

@Component({
  selector: 'app-farmer-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './farmer-banner.component.html',
  styleUrl: './farmer-banner.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FarmerBannerComponent {
  @Input()
  farmer!: Farmer;
  stars: number[] = [1, 2, 3, 4, 5];
}
