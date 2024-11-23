import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { EventCardComponent } from '../event-card/event-card.component';
import { Event } from '../../../../../../../../models/event.interface';

@Component({
  selector: 'app-liked-events',
  standalone: true,
  imports: [CommonModule, EventCardComponent],
  templateUrl: './liked-events.component.html',
  styleUrl: './liked-events.component.scss'
})
export class LikedEventsComponent {
  @Input() likedEvents: Event[] = [];
  @Output() likeEvent = new EventEmitter<Event>();

  public onLikeEvent(event: Event) {
    this.likeEvent.emit(event);
  }
}
