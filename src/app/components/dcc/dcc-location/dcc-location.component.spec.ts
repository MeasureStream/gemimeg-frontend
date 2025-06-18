import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DccLocationComponent } from "./dcc-location.component";

describe("DccLocationComponent", () => {
  let component: DccLocationComponent;
  let fixture: ComponentFixture<DccLocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DccLocationComponent],
    });
    fixture = TestBed.createComponent(DccLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
