import { Component, Input, OnInit } from '@angular/core';

import { DataDto } from 'src/app/generated/dcc/model/dataDto';
import { FormulaDto } from 'src/app/generated/dcc/model/formulaDto';
import { InitializationService } from 'src/app/services/dcc/initialization.service';

@Component({
  selector: 'app-dcc-data',
  templateUrl: './dcc-data.component.html',
  styleUrls: ['./dcc-data.component.scss']
})
export class DccDataComponent implements OnInit {

  @Input() dataTypes!: DataDto[];
  selectedOption: string = 'richContent';
  options: string[] = ['richContent', 'formula', 'byteData', 'quantity', 'list']
  isExpanded: boolean[] = [];

  constructor(private initializationService: InitializationService) {
  }

  ngOnInit(): void {
  }

  onSelectionChange(event: any) {
    this.selectedOption = event.value;
  }

  addObject(option: string) {
    switch (option) {
      case 'byteData':
        var item = this.initializationService.getEmptyDataDto();
        item.byteData = this.initializationService.getEmptyByteDataDto();
        this.dataTypes.push(item);
        break;
      case 'formula':
        var item = this.initializationService.getEmptyDataDto();
        item.formula = this.initializationService.getEmptyFormulaDto();
        this.dataTypes.push(item);
        break;
      case 'richContent':
        var item = this.initializationService.getEmptyDataDto();
        item.richContent = this.initializationService.getEmptyRichContentDto();
        this.dataTypes.push(item);
        break;
      case 'quantity':
        var item = this.initializationService.getEmptyDataDto();
        item.quantity = this.initializationService.getEmptyQuantityDto();
        this.dataTypes.push(item);
        break;
      case 'list':
        var item = this.initializationService.getEmptyDataDto();
        item.list = this.initializationService.getEmptyListDto();
        this.dataTypes.push(item);
        break;
    }
  }

  deleteObject(index: number) {
    this.dataTypes.splice(index, 1);
    this.isExpanded.splice(index, 1);
  }

  toggleCard(index: number) {
    this.isExpanded[index] = !this.isExpanded[index]
  }
}
