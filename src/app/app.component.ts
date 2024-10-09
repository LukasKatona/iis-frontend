import { Component } from '@angular/core';
import { MainContentComponent } from './components/main-content/main-content.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { MainFooterComponent } from './components/main-footer/main-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainHeaderComponent, MainContentComponent, MainFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'efarm';
}
