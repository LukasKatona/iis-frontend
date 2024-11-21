import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { ProductCategory } from '../../../../../../../../models/product-category.interface';
import { HttpClient } from '@angular/common/http';
import { Atribute } from '../../../../../../../../models/atribute.interface';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../../../environments/environment';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoryCardComponent {
  
  @Input() category!: ProductCategory;
  @Input() parentCategoryName: string = '';

  @Output() categoryToEdit = new EventEmitter<void>();
  @Output() categoryDeleted = new EventEmitter<void>();

  public atributes: Atribute[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.category.atributes) {
      this.atributes = JSON.parse(this.category.atributes);
    }
  }

  public onEditcategory() {
    this.categoryToEdit.emit();
  }

  public onDeleteCategory() {
    let url = `${environment.baseUri}/product-categories/${this.category.id}`;

    this.http.delete<boolean>(url).subscribe((data: boolean) => {
      if (data) {
        this.categoryDeleted.emit();
      }
    });
  }
}
