import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DccHumanReadableComponent } from './dcc-human-readable.component';

describe('DccHumanReadableComponent', () => {
  let component: DccHumanReadableComponent;
  let fixture: ComponentFixture<DccHumanReadableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DccHumanReadableComponent]
    });
    fixture = TestBed.createComponent(DccHumanReadableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
