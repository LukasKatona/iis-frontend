import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../../../../../../models/product.interface';
import { environment } from '../../../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-farmer-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './farmer-product-card.component.html',
  styleUrls: ['./farmer-product-card.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FarmerProductCardComponent {
  @Input() product!: Product;
  @Output() editRequested = new EventEmitter<Product>();

  constructor(private http: HttpClient) {}

  editProduct(product: Product) {
    this.editRequested.emit(product); 
  }

  removeProduct(product: Product) {
    const url = `${environment.baseUri}/products/${product.id}`;
    this.http.delete(url).subscribe({});
  }
}
