import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DccSoftwareComponent} from './dcc-software.component';

describe('DccSoftwareComponent', () => {
  let component: DccSoftwareComponent;
  let fixture: ComponentFixture<DccSoftwareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DccSoftwareComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DccSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
