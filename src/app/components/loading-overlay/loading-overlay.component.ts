import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStoreService } from '../../services/auth-store.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoadingOverlayComponent {
  isLoading: boolean | null = null;

  constructor(private authStore: AuthStoreService) {}

  ngOnInit() {
    this.authStore.runningRequests$().subscribe((runningRequests) => {
      if (runningRequests !== null) {
        this.isLoading = runningRequests > 0;
      } else {
        this.isLoading = false;
      }
    });
  }
}
