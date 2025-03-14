import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterImprintComponent } from './footer-imprint.component';

describe('FooterImprintComponent', () => {
  let component: FooterImprintComponent;
  let fixture: ComponentFixture<FooterImprintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterImprintComponent]
    });
    fixture = TestBed.createComponent(FooterImprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
