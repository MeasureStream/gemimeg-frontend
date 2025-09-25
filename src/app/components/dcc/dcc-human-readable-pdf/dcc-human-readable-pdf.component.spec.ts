import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DccHumanReadablePdfComponent } from './dcc-human-readable-pdf.component';

describe('DccHumanReadablePdfComponent', () => {
  let component: DccHumanReadablePdfComponent;
  let fixture: ComponentFixture<DccHumanReadablePdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DccHumanReadablePdfComponent]
    });
    fixture = TestBed.createComponent(DccHumanReadablePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
