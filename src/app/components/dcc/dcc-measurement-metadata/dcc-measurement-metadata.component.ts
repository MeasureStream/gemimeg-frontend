import { Component, Input, OnInit, } from '@angular/core';
import { DataDto } from 'src/app/generated/dcc/model/dataDto';
import { RichContentDto } from 'src/app/generated/dcc/model/richContentDto';
import { StatementDto } from 'src/app/generated/dcc/model/statementDto';
import { DccService } from 'src/app/services/dcc/dcc.service';
import { LanguageSpecificStringsDto } from 'src/app/generated/dcc/model/languageSpecificStringsDto';
import { LangTextPair } from 'src/app/generated/dcc/model/langTextPair';
import { ByteDataDto } from 'src/app/generated/dcc/model/byteDataDto';
import { FormulaDto } from 'src/app/generated/dcc/model/formulaDto';
import { LocationDto } from 'src/app/generated/dcc/model/locationDto';
import { ContactDto } from 'src/app/generated/dcc/model/contactDto';

@Component({
  selector: 'app-dcc-measurement-metadata',
  templateUrl: './dcc-measurement-metadata.component.html',
  styleUrls: ['./dcc-measurement-metadata.component.scss'],

})
export class DccMeasurementMetadataComponent implements OnInit {

  @Input() list: Array<StatementDto>;
  @Input() header: string;


  validConformityStatementStatusTypes = ["pass", "fail", "conditionalPass", "conditionalFail", "noPass", "noFail"];

  isExpanded: boolean[] = [true];

  constructor(public dccService: DccService) {
    this.list = new Array<StatementDto>;
    this.header = "";
  }

  ngOnInit(): void {
  }

  ngOnChanges() {

  }

  getEmptyStatementMetaDataDto(): StatementDto {
    const result = <StatementDto>{};
    result.countryCodes = new Array<string>
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.description = this.getEmptyRichContentDto();
    result.declaration = this.getEmptyRichContentDto();
    result.norms = new Array<string>;
    result.references = new Array<string>;
    result.data = new Array<DataDto>();
    result.location = this.getEmptyLocationDto();
    result.responsibleAuthority = this.getEmptyContactDto();
    return result;
  }

  getEmptyRichContentDto(): RichContentDto {
    const result = <RichContentDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.textContent = this.getEmptyLanguageSpecificStringsDto();
    result.byteDataContent = <ByteDataDto>{};
    result.formulaContent = <FormulaDto>{};
    return result;
  }

  getEmptyContactDto(): ContactDto {
    const result = <ContactDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.location = this.getEmptyLocationDto();
    return result;
  }

  getEmptyLanguageSpecificStringsDto(): LanguageSpecificStringsDto {
    const result = <LanguageSpecificStringsDto>{};
    result.content = new Array<LangTextPair>;
    result.content.push(<LangTextPair>{})
    return result;
  }

  getEmptyLocationDto(): LocationDto {
    var result = <LocationDto>{}
    result.additionalInformation = this.getEmptyRichContentDto();
    return result;

  }

  string2Arr(event: Event, fieldName: keyof StatementDto, index: number) {

    const input = (event.target as HTMLInputElement).value;
    const statement = this.list[index] as StatementDto;


    if (statement[fieldName] !== undefined) {

      const processedArray = input.split(',').map(code => code.trim());

      if (fieldName === 'countryCodes') {
        (statement[fieldName] as string[]) = processedArray.filter(code => code !== '').map(code => code.toUpperCase());
      } else {
        (statement[fieldName] as string[]) = processedArray.filter(code => code !== '');
      }
    }

  }

  toggleCard(index: number) {
    this.isExpanded[index] = !this.isExpanded[index];
  }
  addExpanded() {
    this.isExpanded.push(true);
  }

}
