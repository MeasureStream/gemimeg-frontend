import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DccResponsiblePersonComponent } from './dcc-responsible-person.component';

describe('DccResponsiblePersonComponent', () => {
  let component: DccResponsiblePersonComponent;
  let fixture: ComponentFixture<DccResponsiblePersonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DccResponsiblePersonComponent]
    });
    fixture = TestBed.createComponent(DccResponsiblePersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
