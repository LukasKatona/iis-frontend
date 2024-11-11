import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Product } from '../../../../../../../models/product.interface';
import 'mdui/components/card.js';
import 'mdui/components/checkbox.js';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductCardComponent {
  @Input()
  product!: Product;

}
