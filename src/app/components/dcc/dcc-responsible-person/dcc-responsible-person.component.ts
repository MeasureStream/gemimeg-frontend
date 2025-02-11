import { Component, Input, SimpleChanges } from '@angular/core';
import { ByteDataDto } from 'src/app/generated/dcc/model/byteDataDto';
import { ContactDto } from 'src/app/generated/dcc/model/contactDto';
import { FormulaDto } from 'src/app/generated/dcc/model/formulaDto';
import { LangTextPair } from 'src/app/generated/dcc/model/langTextPair';
import { LanguageSpecificStringsDto } from 'src/app/generated/dcc/model/languageSpecificStringsDto';
import { LocationDto } from 'src/app/generated/dcc/model/locationDto';
import { RichContentDto } from 'src/app/generated/dcc/model/richContentDto';


@Component({
  selector: 'app-dcc-responsible-person',
  templateUrl: './dcc-responsible-person.component.html',
  styleUrls: ['./dcc-responsible-person.component.scss']
})
export class DccResponsiblePersonComponent {
  @Input() list: Array<ContactDto>;
  isExpanded: boolean[] = [true];

  constructor() {
    this.list = new Array<ContactDto>;
  }

  ngOnInit(): void {

  }



  getEmptyRespPersonDto(): ContactDto {
    var result = <ContactDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.location = this.getEmptyLocationDto();
    return result;
  }
  getEmptyLanguageSpecificStringsDto(): LanguageSpecificStringsDto {
    var result = <LanguageSpecificStringsDto>{};
    result.content = new Array<LangTextPair>;
    result.content.push(<LangTextPair>{})
    return result;
  }
  getEmptyLocationDto(): LocationDto {
    var result = <LocationDto>{}
    result.additionalInformation = this.getEmptyRichContentDto();
    return result;
  }
    getEmptyRichContentDto(): RichContentDto {
      var result = <RichContentDto>{};
      result.name = this.getEmptyLanguageSpecificStringsDto();
      result.textContent = this.getEmptyLanguageSpecificStringsDto();
      result.byteDataContent = <ByteDataDto>{};
      result.formulaContent = <FormulaDto>{};
      return result;
    }

    toggleCard(index:number){
      this.isExpanded[index]=!this.isExpanded[index];
    }
    addExpanded() {
      this.isExpanded.push(true);
    }
}
