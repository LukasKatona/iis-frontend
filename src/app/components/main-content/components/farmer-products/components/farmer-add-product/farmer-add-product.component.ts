import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, OnInit } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../../../../models/product.interface';
import { Unit } from '../../../../../../../models/unit.enum';
import { FormsModule } from '@angular/forms';
import { createEmptyProduct } from '../../../../../../../models/product.interface';

@Component({
  selector: 'app-farmer-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './farmer-add-product.component.html',
  styleUrls: ['./farmer-add-product.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FarmerAddProductComponent {
  public product?: Product;
  public unit = Unit;
  public isProductCreated: boolean = false;

  constructor() {
    this.initProduct(); 
  }

  private initProduct() {
    this.product = createEmptyProduct(1);
  }

  public createProduct(field: string, event: any) {
    if (this.product) {
      (this.product as any)[field] = event.target ? event.target.value : event;
    }
  }

  public saveProduct() {
    this.isProductCreated = true;
    fetch(environment.baseUri + '/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.product)
    })
      .then(response => response.json())
      .then(() => {
        this.isProductCreated = true;  
        this.initProduct();
      })
      .catch(error => {
        console.error("Error creating product:", error);
        this.isProductCreated = false;
      });
  }
}
