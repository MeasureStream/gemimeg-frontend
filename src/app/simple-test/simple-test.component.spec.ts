import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTestComponent } from './simple-test.component';

describe('SimpleTestComponent', () => {
  let component: SimpleTestComponent;
  let fixture: ComponentFixture<SimpleTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimpleTestComponent]
    });
    fixture = TestBed.createComponent(SimpleTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should multiply two numbers', () => {
    const result = component.multiply(2, 3);
    expect(result).toEqual(6);
  });
});
