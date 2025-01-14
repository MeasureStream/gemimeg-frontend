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

  item = { date: '' };
  statementDate:Date|any= "2022-09-09"
  startDate = new Date(2024, 1, 1)
  validConformityStatementStatusTypes = ["pass", "fail", "conditionalPass", "conditionalFail", "noPass", "noFail"];

  isExpanded: boolean[] = [true];

  constructor(  public dccService:DccService) {
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




  // Method to format the date to 'YYYY-MM-DD'
  
  marshalCustomDate(value: Date): string {
    const result = new Array<string>();
    if (value) {
      result.push(value.getFullYear().toString());
      result.push((value.getMonth() + 1).toString());
      result.push(value.getDate().toString());
    }
    // Append leading zeros for single-digit month and day
    for (let i = 0; i < result.length; i++) {
      if (result[i].length === 1) {
        result[i] = '0' + result[i];
      }
    }
    return result[0] + '-' + result[1] + '-' + result[2];}

  toggleCard(index: number) {
    this.isExpanded[index] = !this.isExpanded[index];
  }
  addExpanded() {
    this.isExpanded.push(true);
  }

  // Handles the date change event
  onDateChange(event: any) {
    const date: Date = event.value;
    this.item.date = this.marshalCustomDate(date); // Format the date immediately
  }
}
