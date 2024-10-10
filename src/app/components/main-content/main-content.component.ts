import { Component } from '@angular/core';
import { CategoryMenuComponent } from './components/category-menu/category-menu.component';
import { MostPopularComponent } from './components/most-popular/most-popular.component';
import { RouterOutlet } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CategoryMenuComponent, ProductsComponent, RouterOutlet, MostPopularComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

}
