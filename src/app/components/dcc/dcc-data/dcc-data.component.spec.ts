import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DccDataComponent} from './dcc-data.component';

describe('DccDataComponent', () => {
  let component: DccDataComponent;
  let fixture: ComponentFixture<DccDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DccDataComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DccDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
