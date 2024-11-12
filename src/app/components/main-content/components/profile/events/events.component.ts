import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AllEventsComponent } from './components/all-events/all-events.component';
import { FarmerEventsComponent } from './components/farmer-events/farmer-events.component';
import { LikedEventsComponent } from './components/liked-events/liked-events.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [LikedEventsComponent, AllEventsComponent, FarmerEventsComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventsComponent {

}
