import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DccRichContentComponent } from './dcc-richcontent.component';

describe('DccRichcontentComponent', () => {
  let component: DccRichContentComponent;
  let fixture: ComponentFixture<DccRichContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DccRichContentComponent]
    });
    fixture = TestBed.createComponent(DccRichContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
