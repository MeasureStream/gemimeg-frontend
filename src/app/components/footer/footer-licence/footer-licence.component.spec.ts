import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterLicenceComponent } from './footer-licence.component';

describe('FooterLicenceComponent', () => {
  let component: FooterLicenceComponent;
  let fixture: ComponentFixture<FooterLicenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterLicenceComponent]
    });
    fixture = TestBed.createComponent(FooterLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
