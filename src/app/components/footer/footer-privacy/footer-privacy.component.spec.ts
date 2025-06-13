import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPrivacyComponent } from './footer-privacy.component';

describe('FooterPrivacyComponent', () => {
  let component: FooterPrivacyComponent;
  let fixture: ComponentFixture<FooterPrivacyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterPrivacyComponent],
    });
    fixture = TestBed.createComponent(FooterPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
