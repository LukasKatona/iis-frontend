import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerProductCardComponent } from './farmer-product-card.component';

describe('FarmerProductCardComponent', () => {
  let component: FarmerProductCardComponent;
  let fixture: ComponentFixture<FarmerProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmerProductCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmerProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
