import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DccItemListComponent } from './dcc-item-list.component';

describe('DccItemListComponent', () => {
  let component: DccItemListComponent;
  let fixture: ComponentFixture<DccItemListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DccItemListComponent]
    });
    fixture = TestBed.createComponent(DccItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
