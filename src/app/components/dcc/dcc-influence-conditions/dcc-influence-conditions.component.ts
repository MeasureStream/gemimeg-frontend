import { Component, Input, OnInit } from '@angular/core';

import { ConditionDto } from 'src/app/generated/dcc/model/conditionDto';
import { DataDto } from 'src/app/generated/dcc/model/dataDto';
import { InitializationService } from 'src/app/services/dcc/initialization.service';

@Component({
  selector: 'app-dcc-influence-conditions',
  templateUrl: './dcc-influence-conditions.component.html',
  styleUrls: ['./dcc-influence-conditions.component.scss']
})
export class DccInfluenceConditionsComponent implements OnInit {

  @Input() list: Array<ConditionDto>;
  isExpanded:boolean[]=[true];
  validRestrictions = ["beforeAdjustment", "afterAdjustment", "beforeRepair", "afterRepair"];

  constructor(private initializationService: InitializationService) {
    this.list = new Array<ConditionDto>;
    this.addEmptyConditionDto();
  }

  ngOnInit(): void {
  }

  addEmptyConditionDto() {
    this.list.push(this.initializationService.getEmptyConditionDto());
  }

  isQuantity(data: DataDto): boolean {
    return "dimension" in data;
  }

  toggleCard(index: number) {
    this.isExpanded[index]=!this.isExpanded[index];
  }

  addExpanded() {
    this.isExpanded.push(true)
  }
}
