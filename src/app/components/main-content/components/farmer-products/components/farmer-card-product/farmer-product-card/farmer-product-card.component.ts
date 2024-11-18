import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../../../../../../models/product.interface';
import { environment } from '../../../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-farmer-product-card',
  standalone: true,
  imports: [],
  templateUrl: './farmer-product-card.component.html',
  styleUrls: ['./farmer-product-card.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FarmerProductCardComponent {
  @Input() product!: Product;
  @Output() editRequested = new EventEmitter<Product>();

  constructor(private http: HttpClient) {}

  editProduct(product: Product) {
    console.log('Product edited', product);
    this.editRequested.emit(product); 
  }

  removeProduct(product: Product) {
    const url = `${environment.baseUri}/products/${product.id}`;
    this.http.delete(url).subscribe({
      next: () => {
        console.log('Product deleted successfully');
      }
    });
  }
}
