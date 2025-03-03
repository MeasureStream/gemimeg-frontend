import { Component, Input,OnInit } from '@angular/core';

import { RichContentDto } from 'src/app/generated/dcc/model/richContentDto';
import { InitializationService } from 'src/app/services/dcc/initialization.service';

@Component({
  selector: 'app-dcc-richcontent',
  templateUrl: './dcc-richcontent.component.html',
  styleUrls: ['./dcc-richcontent.component.scss']
})
export class DccRichcontentComponent implements OnInit {
  @Input() richContent: RichContentDto | any;

  showLanguageComponent = false;
  showFileComponent = false;
  showMathmlComponent = false;
  languageItems: any[] = [];

  constructor(private initializationService: InitializationService) {
  }

  ngOnInit(): void {
    if (!this.richContent) {
      this.richContent = this.initializationService.getEmptyRichContentDto();
    }
  }

  toggleComponent(component: string) {
    switch (component) {
      case 'language':
        this.showLanguageComponent = !this.showLanguageComponent;
        break;
      case 'file':
        this.showFileComponent = !this.showFileComponent;
        break;
      case 'mathml':
        this.showMathmlComponent = !this.showMathmlComponent;
        break;
    }
  }

  onFileUploading(file: File) {
    console.log('file uploaded', file);
  }
}
