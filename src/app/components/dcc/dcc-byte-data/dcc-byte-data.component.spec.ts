import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DccByteDataComponent } from './dcc-byte-data.component';

describe('DccByteDataComponent', () => {
  let component: DccByteDataComponent;
  let fixture: ComponentFixture<DccByteDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DccByteDataComponent]
    });
    fixture = TestBed.createComponent(DccByteDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
