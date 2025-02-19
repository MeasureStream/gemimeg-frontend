import { Component, Input, OnInit } from '@angular/core';

import { ConditionDto } from 'src/app/generated/dcc/model/conditionDto';
import { DataDto } from 'src/app/generated/dcc/model/dataDto';
import { DimensionDto } from 'src/app/generated/dcc/model/dimensionDto';
import { InitializationService } from 'src/app/services/dcc/initialization.service';

@Component({
  selector: 'app-dcc-influence-conditions',
  templateUrl: './dcc-influence-conditions.component.html',
  styleUrls: ['./dcc-influence-conditions.component.scss']
})
export class DccInfluenceConditionsComponent implements OnInit {
  @Input() list: Array<ConditionDto>;
  validRestrictions = ["beforeAdjustment", "afterAdjustment", "beforeRepair", "afterRepair"];
  isExpanded: boolean[] = [true];
  
  selectedOption: string = 'real';
  defaultDimension: DimensionDto;
  item: DataDto;
  
  constructor(private initializationService: InitializationService) {
    this.list = new Array<ConditionDto>;
    this.defaultDimension = initializationService.getEmptyDimensionDto();
    this.item = initializationService.getEmptyDataDto();
  }

  ngOnInit(): void {
  }

  isQuantity(data: DataDto): boolean {
    return "dimension" in data;
  }

  addNewCondition(): void {
    this.list.push(this.initializationService.getEmptyConditionDto());
  }

  toggleCard(index: number) {
    this.isExpanded[index] = !this.isExpanded[index];
  }

  addExpanded() {
    this.isExpanded.push(true)
  }

  expandedData = {
    valueExpanded: null,
    coverageFactor: null,
    coverageProbability: null,
    distribution: ''
  };

  realData = {
    label: '',
    quantityType: this.selectedOption,
    value: 0,
    unit: '',
    dateTime: new Date()
  };

  defaultQuantity = {
    refTypes: [],
    hybridValues: { dimensions: [{ value: 0, unit: '' }] },
    dimension: { value: 0, unit: '' }
  };
}
