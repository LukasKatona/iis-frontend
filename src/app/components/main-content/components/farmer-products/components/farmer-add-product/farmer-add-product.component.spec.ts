import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerAddProductComponent } from './farmer-add-product.component';

describe('FarmerAddProductComponent', () => {
  let component: FarmerAddProductComponent;
  let fixture: ComponentFixture<FarmerAddProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmerAddProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmerAddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
