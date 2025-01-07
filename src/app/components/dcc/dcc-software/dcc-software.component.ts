import {Component, Input, OnInit} from '@angular/core';

import { LanguageSpecificStringsDto } from 'src/app/generated/dcc/model/languageSpecificStringsDto';
import { LangTextPair } from 'src/app/generated/dcc/model/langTextPair';
import { SoftwareDto } from 'src/app/generated/dcc/model/softwareDto';

@Component({
  selector: 'app-dcc-software',
  templateUrl: './dcc-software.component.html',
  styleUrls: ['./dcc-software.component.scss']
})
export class DccSoftwareComponent implements OnInit {

  @Input() list: SoftwareDto[];
  isExpanded:boolean[]=[true];
  constructor() {
    this.list = new Array<SoftwareDto>;
  }

  ngOnInit(): void {

  }

  getEmptySoftwareDto(): SoftwareDto {
    var result = <SoftwareDto>{};
    result.name = <LanguageSpecificStringsDto>{};
    result.name.content = new Array<LangTextPair>;
    result.name.content.push(<LangTextPair>{})
    return result;
  }

  toggleCard(index:number){
    this.isExpanded[index]=!this.isExpanded[index];
  }
  addExpanded() {
    this.isExpanded.push(true);
  }
}
