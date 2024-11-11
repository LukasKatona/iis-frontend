import { Routes } from '@angular/router';
import { ProductsComponent } from './components/main-content/components/products/products.component';
import { FarmerProductsComponent } from './components/main-content/components/farmer-products/farmer-products.component';

export const routes: Routes = [
    { path: '', component: ProductsComponent },
    { path: 'farmer-products', component: FarmerProductsComponent },
];
