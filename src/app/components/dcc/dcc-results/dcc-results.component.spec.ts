import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DccResultsComponent} from './dcc-results.component';

describe('DccResultsComponent', () => {
  let component: DccResultsComponent;
  let fixture: ComponentFixture<DccResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DccResultsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DccResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
