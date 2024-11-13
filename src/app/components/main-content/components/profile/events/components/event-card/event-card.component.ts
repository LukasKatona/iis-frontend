import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { Event } from '../../../../../../../../models/event.interface';
import { CommonModule, formatDate } from '@angular/common';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventCardComponent {
  @Input() event!: Event;

  @Output() likeEvent = new EventEmitter<Event>();

  public createdAt: string = '';
  public startsAt: string = '';
  public endsAt: string = '';

  ngOnInit() {
    this.createdAt = formatDate(this.event.createdAt*1000, 'dd.MM.yyyy', 'en-US');
    this.startsAt = formatDate(this.event.startDate*1000, 'dd.MM.yyyy HH:MM', 'en-US');
    this.endsAt = formatDate(this.event.endDate*1000, 'dd.MM.yyyy  HH:MM', 'en-US');
  }

  public onLikeEvent() {
    this.likeEvent.emit(this.event);
  }
}
