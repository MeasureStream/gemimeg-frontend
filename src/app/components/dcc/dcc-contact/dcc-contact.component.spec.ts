import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DccContactComponent} from './dcc-contact.component';

describe('DccContactComponent', () => {
  let component: DccContactComponent;
  let fixture: ComponentFixture<DccContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DccContactComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DccContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
