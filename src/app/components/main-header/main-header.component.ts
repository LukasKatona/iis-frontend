import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainHeaderComponent {

}
