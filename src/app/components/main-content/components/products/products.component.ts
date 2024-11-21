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
import { FarmerBannerComponent } from './components/farmer-banner/farmer-banner.component';

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

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {

    this.categoryId = this.route.snapshot.data['categoryId'];
    this.categoryName = this.route.snapshot.data['categoryName'];
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
        this.filterBySearchQuery();
      });
  }

  private filterBySearchQuery(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  public onSearchChange(): void {
    this.filterBySearchQuery();
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

}
