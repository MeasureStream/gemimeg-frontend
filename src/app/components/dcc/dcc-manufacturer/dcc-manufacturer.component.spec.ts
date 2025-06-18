import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DccManufacturerComponent } from './dcc-manufacturer.component';

describe('DccManufacturerComponent', () => {
  let component: DccManufacturerComponent;
  let fixture: ComponentFixture<DccManufacturerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DccManufacturerComponent]
    });
    fixture = TestBed.createComponent(DccManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
