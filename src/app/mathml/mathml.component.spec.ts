import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MathmlComponent } from './mathml.component';

describe('MathmlComponent', () => {
  let component: MathmlComponent;
  let fixture: ComponentFixture<MathmlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MathmlComponent],
    });
    fixture = TestBed.createComponent(MathmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
