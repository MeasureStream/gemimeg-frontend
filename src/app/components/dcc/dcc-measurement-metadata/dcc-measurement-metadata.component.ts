import { Component, Input, OnInit, } from '@angular/core';

import { StatementDto } from 'src/app/generated/dcc/model/statementDto';
import { DccService } from 'src/app/services/dcc/dcc.service';
import { InitializationService } from 'src/app/services/dcc/initialization.service';

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

  constructor(public dccService: DccService, private initializationService: InitializationService) {
    this.list = new Array<StatementDto>;
    this.addEmptyStatementDto();
    this.addExpanded();
    this.header = '';
  }

  ngOnInit(): void {
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

  addEmptyStatementDto() {
    this.list.push(this.initializationService.getEmptyStatementDto());
  }
  
  addExpanded() {
    this.isExpanded.push(true);
  }

  onDateChange(event: any) {
    const date: Date = event.value;
    this.item.date = this.dccService.marshalCustomDate(date);
  }
}
