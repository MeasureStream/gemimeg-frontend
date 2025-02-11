import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DccUploadComponent } from './dcc-upload.component';

describe('DccUploadComponent', () => {
  let component: DccUploadComponent;
  let fixture: ComponentFixture<DccUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DccUploadComponent]
    });
    fixture = TestBed.createComponent(DccUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
