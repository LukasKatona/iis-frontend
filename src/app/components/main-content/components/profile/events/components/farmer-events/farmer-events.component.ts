import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { createEmptyEvent, Event } from '../../../../../../../../models/event.interface';
import { CommonModule, formatDate } from '@angular/common';
import { EventCardComponent } from '../event-card/event-card.component';
import { environment } from '../../../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {
    this.eventToEdit = createEmptyEvent(this.ueserId);
  }

  public fetchEventToEditor(event: Event) {
    this.eventToEdit = { ...event };
    this.startsAt = formatDate(event.startDate*1000, 'yyyy-MM-ddTHH:mm', 'en-US');
    this.endsAt = formatDate(event.endDate*1000, 'yyyy-MM-ddTHH:mm', 'en-US');
  }

  public onDeleteEvent(event: Event) {
    let url = environment.baseUri + '/events/' + event.id;
    this.http.delete(url).subscribe(() => {
      this.eventsChanged.emit();
    });
  }

  public changeEventToEdit(field: string, event: any) {
    if (this.eventToEdit) {
      if (field === 'startDate' || field === 'endDate') {
        this.eventToEdit[field] = new Date(event.target.value).getTime() / 1000;
      } else {
        this.eventToEdit[field] = event.target.value;
      }
    }
  }

  public saveEvent() {
    this.isEventToEditLoading = true;
    if (this.eventToEdit?.id) {
      this.http.patch(environment.baseUri + '/events/' + this.eventToEdit?.id, this.eventToEdit)
        .subscribe(() => {
          this.afterSaveEvent();
        });
    } else {
      this.http.post(environment.baseUri + '/events', this.eventToEdit)
        .subscribe(() => {
          this.afterSaveEvent();
        });
    }
  }

  private afterSaveEvent() {
    this.isEventToEditLoading = false;
    this.eventToEdit = createEmptyEvent(this.ueserId);
    this.startsAt = '';
    this.endsAt = '';
    this.eventsChanged.emit();
  }
}
