import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Product } from '../../../../../models/product.interface';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Farmer } from '../../../../../models/farmer.interface';
import { Review } from '../../../../../models/review.interface';
import { FormsModule } from '@angular/forms';
import { FarmerBannerComponent } from '../farmer-products/components/farmer-banner/farmer-banner.component';
import { FarmerBannerComponent } from './components/farmer-banner/farmer-banner.component';
import { Atribute } from '../../../../../models/atribute.interface';
import { ProductAtribute } from '../../../../../models/product-atribute.interface';
import { filter } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, FormsModule, FarmerBannerComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductsComponent {
  private categoryId: number = 0;
  public categoryName: string = '';
  public categoryAtributes: Atribute[] = [];
  public products: Product[] = [];
  public filteredProducts: Product[] = [];
  public farmers: Farmer[] = [];
  private farmerId?: number = undefined;
  public farmDropdownValue: string = "";
  public farmsForDropdown: Farmer[] = [];
  public farmerBanner?: Farmer;
  public Banner: boolean = false;
  public sortField: string = "";
  public sortDirection: string = "";
  public reviews: Review[] = [];
  public searchQuery: string = '';

  public productAtributesFilter: ProductAtribute[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.data['categoryId'];
    this.categoryName = this.route.snapshot.data['categoryName'];
    this.categoryAtributes = JSON.parse(this.route.snapshot.data['atributes'] || '[]');
    this.productAtributesFilter = this.route.snapshot.data['atributes'] ? this.categoryAtributes.map(a => ({ name: a.name, value: null, comparator: '=' })) : [];

    this.fetchFarmsForDropdown();
    this.getProducts(undefined, this.categoryId, this.farmerId, this.sortField, this.sortDirection);
  }

  private getProducts(nameFilter?: string, categoryIdFilter?: number, farmerIdFilter?: number, sortField?: string, sortDirection?: string): void {
    let url = environment.baseUri + '/products';

    const params: any = {};

    if (nameFilter) {
      params.nameFilter = nameFilter;
    }
    if (categoryIdFilter) {
      params.categoryIdFilter = categoryIdFilter;
    }
    if (sortField) {
      params.sortField = sortField;
    }
    if (sortDirection) {
      params.sortDirection = sortDirection;
    }
    if (farmerIdFilter) {
      params.farmerIdFilter = farmerIdFilter;
    }

    this.http.get<Product[]>(url, { params })
      .subscribe((data: Product[]) => {
        this.products = data;
        this.filteredProducts = [...this.products];
        this.filterProducts();
      });
  }

  private filterProducts(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.filterProductsByAtributes();
  }

  private filterProductsByAtributes(): void {
    this.filteredProducts = this.filteredProducts.filter(product => {
      return this.productAtributesFilter.every(atribute => {

        const productAtribute = JSON.parse(product.categoryAtributes || '[]').find((a: ProductAtribute) => a.name === atribute.name);
        
        console.log(atribute.value);
        
        if (!productAtribute) {
          return false;
        }

        if (atribute.value === null) {
          return true;
        }

        if (typeof atribute.value === 'string' && typeof productAtribute.value === 'string') {
          return productAtribute.value.toLowerCase().includes(atribute.value.toLowerCase());
        }

        if (typeof atribute.value === 'number' && typeof productAtribute.value === 'number') {
          return this.compareNumbers(atribute, productAtribute);
        }

        if (typeof atribute.value === 'boolean' && typeof productAtribute.value === 'boolean') {
          return atribute.value === productAtribute.value;
        }

        return false;
      });
    });
  }

  private compareNumbers(filterAtribute: ProductAtribute, productAtribute: ProductAtribute): boolean {
    if (filterAtribute.comparator === null) {
      return productAtribute.value === filterAtribute.value;
    }

    if (productAtribute.value === null) {
      return false;
    }

    if (filterAtribute.value === null || isNaN(filterAtribute.value as number)) {
      return true;
    }
    
    switch (filterAtribute.comparator) {
      case '=':
        return productAtribute.value === filterAtribute.value;
      case '>':
        return productAtribute.value > filterAtribute.value;
      case '<':
        return productAtribute.value < filterAtribute.value;
      case '>=':
        return productAtribute.value >= filterAtribute.value;
      case '<=':
        return productAtribute.value <= filterAtribute.value;
      default:
        return false;
    }
  }

  public onSearchChange( event: any): void {
    this.searchQuery = event.target.value;
    this.filterProducts();
  }

  public sortProducts(field: string, direction: string): void {
    this.sortField = field;
    this.sortDirection = direction;
    this.getProducts(undefined, this.categoryId, this.farmerId, this.sortField, this.sortDirection);
  }

  private fetchFarmsForDropdown(): void {
    let url = environment.baseUri + '/farmers';
    this.http.get<Farmer[]>(url).subscribe(
      (data: Farmer[]) => {
        this.farmsForDropdown = data;
      }
    );
  }

  public onFarmClicked(farmer: Farmer): void {
    this.farmerId = farmer.id;
    this.farmDropdownValue = farmer.farmName ?? '';
    this.Banner = true;
    this.farmerBanner = farmer;
    this.getProducts(undefined, this.categoryId, this.farmerId, this.sortField, this.sortDirection);
  }

  public changeProductAtributeFilterValue(atribute: ProductAtribute, event: any, fieldType: string) {
    if (fieldType === 'boolean') {
      atribute.value = event.target.checked;
    } else if (fieldType === 'number') {
      atribute.value = parseFloat(event.target.value);
    } else if (fieldType === 'comparator') {
      atribute.comparator = event.target.value;
    } else {
      atribute.value = event.target.value;
    }
    this.filterProducts();
  }
}
