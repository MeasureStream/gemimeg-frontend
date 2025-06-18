import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DccXmlPreviewComponent } from "./dcc-xml-preview.component";

describe("DccXmlPreviewComponent", () => {
  let component: DccXmlPreviewComponent;
  let fixture: ComponentFixture<DccXmlPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DccXmlPreviewComponent],
    });
    fixture = TestBed.createComponent(DccXmlPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
