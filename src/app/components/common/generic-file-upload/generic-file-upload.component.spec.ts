import {ComponentFixture, TestBed} from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {GenericFileUploadComponent} from './generic-file-upload.component';

describe('GenericFileUploadComponent', () => {
  let component: GenericFileUploadComponent;
  let fixture: ComponentFixture<GenericFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue:{} },
      ],
      declarations: [GenericFileUploadComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GenericFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
