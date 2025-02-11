import { Component, Input, OnInit } from '@angular/core';

import { LanguageSpecificStringsDto } from 'src/app/generated/dcc/model/languageSpecificStringsDto';
import { ContactDto } from 'src/app/generated/dcc/model/contactDto';
import { EquipmentDto } from 'src/app/generated/dcc/model/equipmentDto';
import { LocationDto } from 'src/app/generated/dcc/model/locationDto';
import { LangTextPair } from 'src/app/generated/dcc/model/langTextPair';
import { RichContentDto } from 'src/app/generated/dcc/model/richContentDto';
import { ByteDataDto } from 'src/app/generated/dcc/model/byteDataDto';
import { FormulaDto } from 'src/app/generated/dcc/model/formulaDto';

@Component({
  selector: 'app-dcc-measurement-equipment',
  templateUrl: './dcc-measurement-equipment.component.html',
  styleUrls: ['./dcc-measurement-equipment.component.scss']
})
export class DccMeasurementEquipmentComponent implements OnInit {

  @Input() list: Array<EquipmentDto>;
  isExpanded:boolean[]=[true];

  constructor() {
    this.list = new Array<EquipmentDto>;
  }

  ngOnInit(): void {

  }

  getEmptyMeasuringEquipmentDto(): EquipmentDto {
    var result = <EquipmentDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.manufacturer=this.getEmptyContactDto();
    return result;
  }
  getEmptyLanguageSpecificStringsDto(): LanguageSpecificStringsDto {
    var result = <LanguageSpecificStringsDto>{};
    result.content = new Array<LangTextPair>;
    result.content.push(<LangTextPair>{})
    return result;
  }
  getEmptyContactDto(): ContactDto {
    var result = <ContactDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.location = this.getEmptyLocationDto();
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
  addExpanded(){
    this.isExpanded.push(true)
  }
  addItem() {
    this.list.push(this.getEmptyMeasuringEquipmentDto());
  }

}
