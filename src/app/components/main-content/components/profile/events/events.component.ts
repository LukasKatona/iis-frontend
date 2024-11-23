import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { AllEventsComponent } from './components/all-events/all-events.component';
import { FarmerEventsComponent } from './components/farmer-events/farmer-events.component';
import { LikedEventsComponent } from './components/liked-events/liked-events.component';
import { environment } from '../../../../../../environments/environment';
import { Event } from '../../../../../../models/event.interface';
import { HttpClient } from '@angular/common/http';
import { AuthStoreService } from '../../../../../services/auth-store.service';
import { User } from '../../../../../../models/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, LikedEventsComponent, AllEventsComponent, FarmerEventsComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventsComponent implements OnInit {
  user: User | null = null;

  public likedEvents: Event[] = [];
  public allEvents: Event[] = [];
  public farmerEvents: Event[] = [];

  constructor(private http: HttpClient, private authStore: AuthStoreService) {}

  ngOnInit(): void {
    this.authStore.loggedUser$().subscribe(user => {
      this.user = user;
      if (!this.user) {
        return;
      }
      this.fetchAllData();
    });
  }

  public fetchAllData() {
    this.farmerEvents = [];
    Promise.all([this.fetchLikedEvents(), this.fetchAllEvents()])
      .then(() => {
        this.allEvents.forEach((event: Event) => {
          if (this.likedEvents.find((likedEvent: Event) => likedEvent.id === event.id)) {
            event.isLikedByLoggedUser = true;
          }
          if (event.createdById === this.user?.id) {
            this.farmerEvents.push(event);
          }
        });
      });
  }

  private fetchLikedEvents(): Promise<void> {
    let url = environment.baseUri + '/events/' + this.user?.id;
    return this.http.get<Event[]>(url)
      .toPromise()
      .then((data: Event[] | undefined) => {
        if (data) {
          this.likedEvents = data.map((event: Event) => { event.isLikedByLoggedUser = true; return event; });
        }
      });
  }

  private fetchAllEvents(): Promise<void> {
    let url = environment.baseUri + '/events';
    return this.http.get<Event[]>(url)
      .toPromise()
      .then((data: Event[] | undefined) => {
        if (data) {
          this.allEvents = data;
        }
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
    let url = environment.baseUri + '/events/' + event.id + '/join/' + this.user?.id;
    this.http.post(url, {}).subscribe(() => {
      this.fetchAllData();
    });
  }

  private leaveEvent(event: Event) {
    let url = environment.baseUri + '/events/' + event.id + '/leave/' + this.user?.id;
    this.http.delete(url).subscribe(() => {
      this.fetchAllData();
    });
  }
}
