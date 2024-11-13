import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AllEventsComponent } from './components/all-events/all-events.component';
import { FarmerEventsComponent } from './components/farmer-events/farmer-events.component';
import { LikedEventsComponent } from './components/liked-events/liked-events.component';
import { environment } from '../../../../../../environments/environment';
import { Event } from '../../../../../../models/event.interface';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [LikedEventsComponent, AllEventsComponent, FarmerEventsComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventsComponent {
  userId = 3;

  public likedEvents: Event[] = [];
  public allEvents: Event[] = [];

  constructor() {
    this.fetchAllData();
  }

  private fetchAllData() {
    Promise.all([this.fetchLikedEvents(), this.fetchAllEvents()])
      .then(() => {
        this.allEvents.forEach((event: Event) => {
          if (this.likedEvents.find((likedEvent: Event) => likedEvent.id === event.id)) {
            event.isLikedByLoggedUser = true;
          }
        });
      });
  }

  private fetchLikedEvents(): Promise<void> {
    let url = environment.baseUri + '/events/' + this.userId;
    return fetch(url)
      .then(response => response.json())
      .then((data: Event[]) => {
        this.likedEvents = data.map((event: Event) => { event.isLikedByLoggedUser = true; return event; });
      });
  }

  private fetchAllEvents(): Promise<void> {
    let url = environment.baseUri + '/events';
    return fetch(url)
      .then(response => response.json())
      .then((data: Event[]) => {
        this.allEvents = data;
      });
  }

  public onLikeEvent(event: any) {
    if (event.isLikedByLoggedUser) {
      this.leaveEvent(event);
    } else {
      this.joinEvent(event);
    }
  }

  private joinEvent(event: Event) {
    let url = environment.baseUri + '/events/' + event.id + '/join/' + this.userId;
    fetch(url, { method: 'POST' })
      .then(() => {
        this.fetchAllData();
      });
  }

  private leaveEvent(event: Event) {
    let url = environment.baseUri + '/events/' + event.id + '/leave/' + this.userId;
    fetch(url, { method: 'DELETE' })
      .then(() => {
        this.fetchAllData();
      });
  }
}
