import { Component, Input, OnInit } from '@angular/core';

import { LanguageSpecificStringsDto } from 'src/app/generated/dcc/model/languageSpecificStringsDto';
import { IdentificationDto } from 'src/app/generated/dcc/model/identificationDto';
import { LangTextPair } from 'src/app/generated/dcc/model/langTextPair';

@Component({
  selector: 'app-dcc-identifications',
  templateUrl: './dcc-identifications.component.html',
  styleUrls: ['./dcc-identifications.component.scss']
})
export class DccIdentificationsComponent implements OnInit {

  @Input() list: Array<IdentificationDto>;
  isExpanded:boolean[]=[true];
  validIdentificationIssuers = ["manufacturer", "calibrationLaboratory", "customer", "owner", "other"];


  constructor() {
    this.list = new Array<IdentificationDto>();
  }

  ngOnInit(): void {

  }

  getEmptyIdentifictionDto(): IdentificationDto {
    var result =<IdentificationDto>{}
    result.issuer="";
    result.value="";
    result.name=this.getEmptyLanguageSpecificStringsDto();
    return result;
  }
  getEmptyLanguageSpecificStringsDto(): LanguageSpecificStringsDto {
    var result = <LanguageSpecificStringsDto>{};
    result.content = new Array<LangTextPair>;
    result.content.push(<LangTextPair>{})
    return result;
  }
  toggleCard(index:number){
    console.log('toggle: ',index)
    this.isExpanded[index]=!this.isExpanded[index];
    console.log('index: ',this.isExpanded[index])
  }
  addExpanded(){
    this.isExpanded.push(true);
    console.log('isExpanded', this.isExpanded)
  }
}
