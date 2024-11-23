import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../../../../../../models/product.interface';
import { environment } from '../../../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductAtribute } from '../../../../../../../../models/product-atribute.interface';

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
  public productAtributes: ProductAtribute[] = [];
  @Output() editRequested = new EventEmitter<Product>();
  @Output() productUpdated = new EventEmitter<Product>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.productAtributes = JSON.parse(this.product.categoryAtributes || '[]');
  }

  editProduct(product: Product) {
    this.editRequested.emit(product); 
  }

  deleteProduct(product: Product) {
    const url = `${environment.baseUri}/products/${product.id}`;
    this.http.delete(url).subscribe(() => {
      this.productUpdated.emit(undefined);
    });
  }
}
