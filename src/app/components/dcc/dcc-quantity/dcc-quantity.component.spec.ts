import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DccQuantityComponent} from './dcc-quantity.component';

describe('DccQuantityComponent', () => {
  let component: DccQuantityComponent;
  let fixture: ComponentFixture<DccQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DccQuantityComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DccQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
