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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductsComponent {
  private categoryId: number = 0;
  public categoryName: string = '';
  public products: Product[] = [];
  public farmers: Farmer[] = [];
  public farmDropdownValue: string = "";
  public sortField: string = "";
  public sortDirection: string = "";
  public farmsForDropdown: Farmer[] = [];
  public reviews: Review[] = [];
  public maxPrice: number = 0;
  public priceRange: number[] = [0, this.maxPrice];
  public searchQuery: string = '';
  private searchSubject: Subject<string> = new Subject<string>();
  public filteredProducts: Product[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {

    this.categoryId = this.route.snapshot.data['categoryId'];
    this.categoryName = this.route.snapshot.data['categoryName'];
    this.fetchFarmsForDropdown();
    this.getProducts(undefined, this.categoryId, undefined, undefined);
  }

  private filterByPrice(): void {
    this.products = this.products.filter(product =>
      product.unitPrice >= this.priceRange[0] && product.unitPrice <= this.priceRange[1]
    );
  }

  private calculateMaxPrice(): void {
    const prices = this.products.map(product => product.unitPrice);
    this.maxPrice = Math.max(...prices);
    this.priceRange = [0, this.maxPrice];
  }

  public onPriceChange(event: any): void {
    console.log('Price slider event:', event);
    if (event && Array.isArray(event.value) && event.value.length === 2) {
      const [minPrice, maxPrice] = event.value;
      this.priceRange = [minPrice, maxPrice];
      this.getProducts();
    }
  }

  private fetchReviews(): void {
    const url = `${environment.baseUri}/reviews`;
    this.http.get<Review[]>(url).subscribe((reviews: Review[]) => {
      this.reviews = reviews;
      this.calculateRatings();
    });
  }

  public sortProductsByRating(): void {
    this.fetchReviews();
    this.products.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }

  private calculateRatings(): void {
    this.products.forEach(product => {
      const productReviews = this.reviews.filter(review => review.productId === product.id);
      const averageRating = productReviews.length > 0
        ? productReviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) / productReviews.length
        : 0;
      product.rating = averageRating;
    });
    this.sortProductsByRating();
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
        if (this.maxPrice === 0 && this.products.length > 0) {
          this.calculateMaxPrice();
        }
        this.filterByPrice();
      });
  }

  public sortProducts(field: string, direction: string): void {
    this.sortField = field;
    this.sortDirection = direction;
    this.getProducts(undefined, this.categoryId, undefined, field, direction);
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
    this.farmDropdownValue = farmer.farmName ?? '';
    this.getProducts(undefined, this.categoryId, farmer.id, undefined, undefined);
  }

}
