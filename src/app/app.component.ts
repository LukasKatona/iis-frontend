import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'efarm';

  public testEndpoint() {
    const baseUri = "https://closed-sapphire-lukokat-71c0d315.koyeb.app/";

    // Test GET request
    fetch(baseUri + "items/0")
      .then(response => response.json())
      .then(data => console.log(data));
  }
}
