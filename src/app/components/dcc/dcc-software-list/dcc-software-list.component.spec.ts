import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DccInstalledSoftwareListComponent } from './dcc-software-list.component';

describe('DccInstalledSoftwareComponent', () => {
  let component: DccInstalledSoftwareListComponent;
  let fixture: ComponentFixture<DccInstalledSoftwareListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DccInstalledSoftwareListComponent]
    });
    fixture = TestBed.createComponent(DccInstalledSoftwareListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
