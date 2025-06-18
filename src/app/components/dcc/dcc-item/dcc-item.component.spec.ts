import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DccItemComponent } from './dcc-item.component';

describe('DccItemComponent', () => {
  let component: DccItemComponent;
  let fixture: ComponentFixture<DccItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DccItemComponent]
    });
    fixture = TestBed.createComponent(DccItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
