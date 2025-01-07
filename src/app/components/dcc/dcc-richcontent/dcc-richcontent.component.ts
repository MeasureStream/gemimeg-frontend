import { Component, Input,OnInit } from '@angular/core';
import { ByteDataDto } from 'src/app/generated/dcc/model/byteDataDto';
import { FormulaDto } from 'src/app/generated/dcc/model/formulaDto';
import { LangTextPair } from 'src/app/generated/dcc/model/langTextPair';
import { LanguageSpecificStringsDto } from 'src/app/generated/dcc/model/languageSpecificStringsDto';
import { RichContentDto } from 'src/app/generated/dcc/model/richContentDto';

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

  constructor() {

  }

  ngOnInit(): void {
   
    if (!this.richContent) {
      this.richContent = this.getEmptyRichContent();
    }
  }

  getEmptyRichContent():RichContentDto{
    var result = <RichContentDto>{};
    result.name=<LanguageSpecificStringsDto>{};
    result.textContent=<LanguageSpecificStringsDto>{};
    result.byteDataContent= <ByteDataDto>{};
    result.formulaContent=<FormulaDto>{};
    return result;
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
  getEmptyRichContentDto():RichContentDto{
    var result = <RichContentDto>{};
    result.name=this.getEmptyLanguageSpecificStringsDto();
    result.textContent=this.getEmptyLanguageSpecificStringsDto();
    result.byteDataContent= <ByteDataDto>{};
    result.formulaContent=<FormulaDto>{};
    return result;
  }
  getEmptyLanguageSpecificStringsDto(): LanguageSpecificStringsDto {
      var result = <LanguageSpecificStringsDto>{};
      result.content = new Array<LangTextPair>;
      result.content.push(<LangTextPair>{})
      return result;
    }

  getEmptyContent(): LangTextPair {
    var result = <LangTextPair>{};
    return result;
  }
}
