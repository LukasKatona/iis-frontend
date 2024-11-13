import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../../../../../environments/environment';
import { EventCardComponent } from '../event-card/event-card.component';
import { CommonModule } from '@angular/common';
import { Event } from '../../../../../../../../models/event.interface';

@Component({
  selector: 'app-all-events',
  standalone: true,
  imports: [CommonModule, EventCardComponent],
  templateUrl: './all-events.component.html',
  styleUrl: './all-events.component.scss'
})
export class AllEventsComponent {
  @Input() allEvents: Event[] = [];
  @Output() likeEvent = new EventEmitter<Event>();

  public onLikeEvent(event: Event) {
    this.likeEvent.emit(event);
  }
}
