import { Component, Input, OnInit } from '@angular/core';

import { LanguageSpecificStringsDto } from 'src/app/generated/dcc/model/languageSpecificStringsDto';
import { ConditionDto } from 'src/app/generated/dcc/model/conditionDto';
import { DataDto } from 'src/app/generated/dcc/model/dataDto';
import { LangTextPair } from 'src/app/generated/dcc/model/langTextPair';

@Component({
  selector: 'app-dcc-influence-conditions',
  templateUrl: './dcc-influence-conditions.component.html',
  styleUrls: ['./dcc-influence-conditions.component.scss']
})
export class DccInfluenceConditionsComponent implements OnInit {

  @Input() list: Array<ConditionDto>;
  validRestrictions = ["beforeAdjustment", "afterAdjustment", "beforeRepair", "afterRepair"];

  constructor() {
    this.list = new Array<ConditionDto>;
  }

  ngOnInit(): void {

  }

  getEmptyConditionDto(): ConditionDto {
    var result = <ConditionDto>{};
    result.name = <LanguageSpecificStringsDto>{};
    result.name.content = new Array<LangTextPair>;
    result.name.content.push(<LangTextPair>{})
    result.data = new Array<DataDto>;
    result.data.push(<DataDto>{});
    return result;
  }

  isQuantity(data: DataDto): boolean {
    return "dimension" in data;
  }
}
