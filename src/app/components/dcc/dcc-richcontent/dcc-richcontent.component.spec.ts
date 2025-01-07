import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DccRichcontentComponent } from './dcc-richcontent.component';

describe('DccRichcontentComponent', () => {
  let component: DccRichcontentComponent;
  let fixture: ComponentFixture<DccRichcontentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DccRichcontentComponent]
    });
    fixture = TestBed.createComponent(DccRichcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
