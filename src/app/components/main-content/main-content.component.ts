import { Component } from '@angular/core';
import { CategoryMenuComponent } from './components/category-menu/category-menu.component';
import { MostPopularComponent } from './components/most-popular/most-popular.component';
import { RouterModule } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, CategoryMenuComponent, ProductsComponent, RouterModule, MostPopularComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

}
