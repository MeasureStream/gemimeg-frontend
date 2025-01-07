import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DccInfluenceConditionsComponent} from './dcc-influence-conditions.component';

describe('DccInfluenceConditionsComponent', () => {
  let component: DccInfluenceConditionsComponent;
  let fixture: ComponentFixture<DccInfluenceConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DccInfluenceConditionsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DccInfluenceConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
