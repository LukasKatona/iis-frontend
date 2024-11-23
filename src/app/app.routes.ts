import { Routes } from '@angular/router';
import { ProductsComponent } from './components/main-content/components/products/products.component';
import { FarmerProductsComponent } from './components/main-content/components/farmer-products/farmer-products.component';
import { PersonalInfoComponent } from './components/main-content/components/profile/personal-info/personal-info.component';
import { OrdersComponent } from './components/main-content/components/profile/orders/orders.component';
import { EventsComponent } from './components/main-content/components/profile/events/events.component';
import { CategoriesComponent } from './components/main-content/components/profile/categories/categories.component';
import { ShoppingCartComponent } from './components/main-content/components/shopping-cart/shopping-cart.component';
import { AdminPageComponent } from './components/main-content/components/admin/admin-page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'shop', pathMatch: 'full' },
    { path: 'shop', component: ProductsComponent },
    { path: 'shop/farmer-products', component: FarmerProductsComponent },
    { path: 'profile/info', component:  PersonalInfoComponent},
    { path: 'profile/orders', component:  OrdersComponent},
    { path: 'profile/events', component:  EventsComponent},
    { path: 'profile/categories', component:  CategoriesComponent},
    { path: 'shopping-cart', component: ShoppingCartComponent },
    { path: 'admin-page', component: AdminPageComponent }
];
