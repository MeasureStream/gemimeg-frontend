import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DccMeasurementMetadataComponent} from './dcc-measurement-metadata.component';

describe('DccMeasurementMetadataComponent', () => {
  let component: DccMeasurementMetadataComponent;
  let fixture: ComponentFixture<DccMeasurementMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DccMeasurementMetadataComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DccMeasurementMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
