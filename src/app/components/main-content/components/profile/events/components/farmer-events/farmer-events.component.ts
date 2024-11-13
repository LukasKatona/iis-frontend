import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { createEmptyEvent, Event } from '../../../../../../../../models/event.interface';
import { CommonModule, formatDate } from '@angular/common';
import { EventCardComponent } from '../event-card/event-card.component';
import { environment } from '../../../../../../../../environments/environment';

@Component({
  selector: 'app-farmer-events',
  standalone: true,
  imports: [CommonModule, EventCardComponent],
  templateUrl: './farmer-events.component.html',
  styleUrl: './farmer-events.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FarmerEventsComponent {
  ueserId = 1;

  public eventToEdit?: Event;
  public isEventToEditLoading: boolean = false;
  public startsAt: string = '';
  public endsAt: string = '';

  @Input() farmerEvents: Event[] = [];

  @Output() eventsChanged = new EventEmitter<void>();

  constructor() {
    this.eventToEdit = createEmptyEvent(this.ueserId);
  }

  public fetchEventToEditor(event: Event) {
    this.eventToEdit = { ...event };
    this.startsAt = formatDate(event.startDate*1000, 'yyyy-MM-dd', 'en-US');
    this.endsAt = formatDate(event.endDate*1000, 'yyyy-MM-dd', 'en-US');
  }

  public onEditEvent(event: Event) {
    console.log('Edit event', event);
  }

  public onDeleteEvent(event: Event) {
    let url = environment.baseUri + '/events/' + event.id;
    fetch(url, {
      method: 'DELETE'
    })
    .then(() => {
      this.eventsChanged.emit();
    });
  }

  public changeEventToEdit(field: string, event: any) {
    if (this.eventToEdit) {
      if (field === 'startDate' || field === 'endDate') {
        console.log('Date', event.target.value);
        this.eventToEdit[field] = new Date(event.target.value).getTime() / 1000;
      } else {
        this.eventToEdit[field] = event.target.value;
      }
    }
  }

  public saveEvent() {
    this.isEventToEditLoading = true;
    if (this.eventToEdit?.id) {
      fetch(environment.baseUri + '/events/' + this.eventToEdit?.id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.eventToEdit)
      })
      .then(() => {
        this.isEventToEditLoading = false;
        this.eventToEdit = createEmptyEvent(this.ueserId);
        this.startsAt = '';
        this.endsAt = '';
        this.eventsChanged.emit();
      });
    } else {
      fetch(environment.baseUri + '/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.eventToEdit)
      })
      .then(() => {
        this.isEventToEditLoading = false;
        this.eventToEdit = createEmptyEvent(this.ueserId);
        this.startsAt = '';
        this.endsAt = '';
        this.eventsChanged.emit();
      });
    }
  }
}
