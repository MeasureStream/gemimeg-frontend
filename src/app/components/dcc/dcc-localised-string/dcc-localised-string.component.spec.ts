import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DccLocalisedStringComponent} from './dcc-localised-string.component';

describe('DccLocalisedStringComponent', () => {
  let component: DccLocalisedStringComponent;
  let fixture: ComponentFixture<DccLocalisedStringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DccLocalisedStringComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DccLocalisedStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
