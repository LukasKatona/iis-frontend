import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CategoryMenuComponent } from './components/category-menu/category-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CategoryMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'efarm';
}
