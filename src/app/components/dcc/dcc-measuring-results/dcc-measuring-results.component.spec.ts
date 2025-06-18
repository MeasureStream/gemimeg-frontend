import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DccMeasuringResultsComponent } from './dcc-measuring-results.component';

describe('DccMeasuringResultsComponent', () => {
  let component: DccMeasuringResultsComponent;
  let fixture: ComponentFixture<DccMeasuringResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DccMeasuringResultsComponent]
    });
    fixture = TestBed.createComponent(DccMeasuringResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
