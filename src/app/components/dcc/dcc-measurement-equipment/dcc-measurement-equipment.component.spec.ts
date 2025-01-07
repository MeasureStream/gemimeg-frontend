import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DccMeasurementEquipmentComponent} from './dcc-measurement-equipment.component';

describe('DccMeasurementEquipmentComponent', () => {
  let component: DccMeasurementEquipmentComponent;
  let fixture: ComponentFixture<DccMeasurementEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DccMeasurementEquipmentComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DccMeasurementEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
