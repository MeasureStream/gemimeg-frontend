import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DccIdentificationsComponent} from './dcc-identifications.component';

describe('DccIdentificationsComponent', () => {
  let component: DccIdentificationsComponent;
  let fixture: ComponentFixture<DccIdentificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DccIdentificationsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DccIdentificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
