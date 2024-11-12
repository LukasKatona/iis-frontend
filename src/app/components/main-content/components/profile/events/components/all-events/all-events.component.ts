import { Component } from '@angular/core';
import { environment } from '../../../../../../../../environments/environment';
import { EventCardComponent } from '../event-card/event-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-events',
  standalone: true,
  imports: [CommonModule, EventCardComponent],
  templateUrl: './all-events.component.html',
  styleUrl: './all-events.component.scss'
})
export class AllEventsComponent {

  events: Event[] = [];

  constructor() {
    this.fetchEvents();
  }

  private fetchEvents() {
    let url = environment.baseUri + '/events';
    fetch(url)
      .then(response => response.json())
      .then((data: Event[]) => {
        this.events = data;
        console.log(data);
      });
  }
}
