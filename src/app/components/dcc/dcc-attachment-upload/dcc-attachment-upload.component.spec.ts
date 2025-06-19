import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DccAttachmentUploadComponent } from './dcc-attachment-upload.component';

describe('DccAttachmentUploadComponent', () => {
  let component: DccAttachmentUploadComponent;
  let fixture: ComponentFixture<DccAttachmentUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DccAttachmentUploadComponent]
    });
    fixture = TestBed.createComponent(DccAttachmentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
