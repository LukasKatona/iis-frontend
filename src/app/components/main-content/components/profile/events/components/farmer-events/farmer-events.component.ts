import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { createEmptyEvent, Event } from '../../../../../../../../models/event.interface';
import { CommonModule, formatDate } from '@angular/common';
import { EventCardComponent } from '../event-card/event-card.component';
import { environment } from '../../../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthStoreService } from '../../../../../../../services/auth-store.service';
import { User } from '../../../../../../../../models/user.interface';

@Component({
  selector: 'app-farmer-events',
  standalone: true,
  imports: [CommonModule, EventCardComponent],
  templateUrl: './farmer-events.component.html',
  styleUrl: './farmer-events.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FarmerEventsComponent implements OnInit {

  user: User | null = null;

  public eventToEdit?: Event;
  public isEventToEditLoading: boolean = false;
  public startsAt: string = '';
  public endsAt: string = '';

  public isFormValid: boolean = false;

  @Input() farmerEvents: Event[] = [];

  @Output() eventsChanged = new EventEmitter<void>();

  constructor(private http: HttpClient, private authStore: AuthStoreService) {}

  ngOnInit(): void {
    this.authStore.loggedUser$().subscribe(user => {
      this.user = user;
      if (!this.user) {
        return;
      }
      if (this.user?.id) {
        this.eventToEdit = createEmptyEvent(this.user?.id);
      }
      this.isFormValid = this.validateEvent();
    });
  }

  public fetchEventToEditor(event: Event) {
    this.eventToEdit = { ...event };
    this.startsAt = formatDate(event.startDate*1000, 'yyyy-MM-ddTHH:mm', 'en-US');
    this.endsAt = formatDate(event.endDate*1000, 'yyyy-MM-ddTHH:mm', 'en-US');
    this.isFormValid = this.validateEvent();
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
        if (field === 'startDate') {
          this.startsAt = event.target.value;
        }
        if (field === 'endDate') {
          this.endsAt = event.target.value;
        }
      } else {
        this.eventToEdit[field] = event.target.value;
      }
    }
    this.isFormValid = this.validateEvent();
  }

  private validateEvent(): boolean {
    if (this.eventToEdit?.name && this.startsAt && this.endsAt) {
      return true;
    }
    return false;
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
    if (this.user?.id) this.eventToEdit = createEmptyEvent(this.user?.id);
    this.startsAt = '';
    this.endsAt = '';
    this.isFormValid = false;
    this.eventsChanged.emit();
  }
}
