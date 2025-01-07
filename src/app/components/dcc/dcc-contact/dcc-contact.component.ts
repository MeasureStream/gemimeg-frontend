import { Component, Input, OnInit } from '@angular/core';
import { ByteDataDto } from 'src/app/generated/dcc/model/byteDataDto';

import { ContactDto } from 'src/app/generated/dcc/model/contactDto';
import { FormulaDto } from 'src/app/generated/dcc/model/formulaDto';
import { LangTextPair } from 'src/app/generated/dcc/model/langTextPair';
import { LanguageSpecificStringsDto } from 'src/app/generated/dcc/model/languageSpecificStringsDto';
import { LocationDto } from 'src/app/generated/dcc/model/locationDto';
import { RichContentDto } from 'src/app/generated/dcc/model/richContentDto';

@Component({
  selector: 'app-dcc-contact, [app-dcc-contact]',
  templateUrl: './dcc-contact.component.html',
  styleUrls: ['./dcc-contact.component.scss']
})
export class DccContactComponent implements OnInit {
  @Input() contact: ContactDto;
  @Input() strict: boolean;

  constructor() {
    this.strict = true;
    this.contact = <ContactDto>{};
    this.getEmptyContactDto();
  }

  ngOnInit(): void {

  }
  getEmptyContactDto(): ContactDto {
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
}
