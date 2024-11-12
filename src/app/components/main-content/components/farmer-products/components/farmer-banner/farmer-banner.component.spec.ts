import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerBannerComponent } from './farmer-banner.component';

describe('FarmerBannerComponent', () => {
  let component: FarmerBannerComponent;
  let fixture: ComponentFixture<FarmerBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmerBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmerBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
