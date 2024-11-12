import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../../../../../../models/product.interface';
import { environment } from '../../../../../../../../environments/environment';

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

  editProduct(product: Product) {
    console.log('Product edited', product);
    this.editRequested.emit(product); 
  }

  removeProduct(product: Product) {
    const url = `${environment.baseUri}/products/${product.id}`;
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (response.ok) {
        console.log('Product deleted successfully');
      } else {
        throw new Error('Failed to delete product');
      }
    })
    .catch(error => {
      console.error('Error deleting product:', error);
    });
  }
}
