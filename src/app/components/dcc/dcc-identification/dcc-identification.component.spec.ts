import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DccIdentificationComponent } from './dcc-identification.component';

describe('DccIndificationComponent', () => {
  let component: DccIdentificationComponent;
  let fixture: ComponentFixture<DccIdentificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DccIdentificationComponent]
    });
    fixture = TestBed.createComponent(DccIdentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
