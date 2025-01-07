import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DccUsedMethodsComponent} from './dcc-used-methods.component';

describe('DccUsedMethodsComponent', () => {
  let component: DccUsedMethodsComponent;
  let fixture: ComponentFixture<DccUsedMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DccUsedMethodsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DccUsedMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
