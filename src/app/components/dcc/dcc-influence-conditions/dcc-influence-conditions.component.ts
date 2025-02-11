import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConditionDto } from 'src/app/generated/dcc/model/conditionDto';
import { DataDto } from 'src/app/generated/dcc/model/dataDto';

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
  defaultDimension = { value: 0, unit: '' };
  item: DataDto | any = {
    refTypes: '',
    data: [{
      quantity: {
        refTypes: '',
        hybridValues: {
          dimensions: [{ value: 0, unit: '' }],
        },
        dimension: { value: 0, unit: '' },
      },
    }]
  };
  
  constructor(private http: HttpClient) {
    this.list = new Array<ConditionDto>;
  }

  ngOnInit(): void {
  }

  getEmptyConditionDto(): ConditionDto {
    const result: ConditionDto = {
      name: {
        content: [{
          lang: 'en',
          text: '',
        },
        {
          lang: 'de',
          text: '',
        }],
      },
      status: '',
      refTypes: [],
      data: [{
        quantity: {
          refTypes:  [],
          hybridValues: {
            dimensions: [{ value: 0, unit: '' }],
          },
        },
      }],
    };
    return result;
  }

  isQuantity(data: DataDto): boolean {
    return "dimension" in data;
  }

  addNewCondition(): void {
    this.list.push(this.getEmptyConditionDto());
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
    quantityType: '',
    value: null,
    unit: '',
    dateTime: new Date()
  };

  defaultQuantity = {
    refTypes: '',
    hybridValues: { dimensions: [{ value: '', unit: '' }] },
    dimension: { value: '', unit: '' },
  };
}
