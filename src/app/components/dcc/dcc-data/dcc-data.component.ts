import { Component, Input, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import { QuantityDto } from 'src/app/generated/dcc/model/quantityDto';
import { DataDto } from 'src/app/generated/dcc/model/dataDto';
import { DimensionDto } from 'src/app/generated/dcc/model/dimensionDto';
import { LanguageSpecificStringsDto } from 'src/app/generated/dcc/model/languageSpecificStringsDto';
import { LangTextPair } from 'src/app/generated/dcc/model/langTextPair';
import { RichContentDto } from 'src/app/generated/dcc/model/richContentDto';
import { ByteDataDto } from 'src/app/generated/dcc/model/byteDataDto';
import { FormulaDto } from 'src/app/generated/dcc/model/formulaDto';

@Component({
  selector: 'app-dcc-data',
  templateUrl: './dcc-data.component.html',
  styleUrls: ['./dcc-data.component.scss']
})
export class DccDataComponent implements OnInit {

  @Input() dataTypes!: DataDto[];
  selectedOption: string = 'RichContent';
  options: string[] = ['RichContent', 'Formel', 'ByteData', 'Quantity', 'Liste']
  isExpanded: boolean[] = [];
  byteData!: any;
  formula!: any;
  quantity!: any;
  richContent!: any;
  list!: any;


  constructor(private logger: NGXLogger) {
    // this.dataType = <DataDto>{};
  }

  ngOnInit(): void {
    // this.logger.trace("ngOnInit::(rawInput:{})",JSON.stringify(this.dataType))
    this.getEmptyDataDto();
    this.getEmptyByteDataDto();
    this.getEmptyFormulaDto();
    this.getEmptyRichContentDto();
    this.getEmptyLanguageSpecificStringsDto();
  }

  getEmptyDataDto() {
    var result = <DataDto>{};
    result.quantity = <QuantityDto>{};
    result.quantity.dimension = <DimensionDto>{};
    return result;
  }
  getEmptyByteDataDto() {
    var result = <ByteDataDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.mimeType = "";
    result.fileName = "";
    result.description = this.getEmptyRichContentDto();
    return result;
  }
  getEmptyFormulaDto(): FormulaDto {
    const result = <FormulaDto>{};
    result.content = '';
    result.type = FormulaDto.TypeEnum.Mathml;
    return result;
  }

  getEmptyLanguageSpecificStringsDto(): LanguageSpecificStringsDto {
    const result = <LanguageSpecificStringsDto>{};
    result.content = new Array<LangTextPair>;
    result.content.push(<LangTextPair>{})
    return result;
  }

  getEmptyRichContentDto(): RichContentDto {
    const result = <RichContentDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.byteDataContent = <ByteDataDto>{};
    result.formulaContent = <FormulaDto>{};
    return result
  }

  onSelectionChange(event: any) {
    this.selectedOption = event.value;
  }

  addObject(option: string) {
    switch (option) {
      case 'ByteData':
        this.dataTypes.push(this.byteData = { 'byteData': this.getEmptyByteDataDto() });
        break;
      case 'Formel':
        this.dataTypes.push(this.formula = { 'formula': this.getEmptyFormulaDto() });
        break;
      case 'RichContent':
        this.dataTypes.push(this.richContent = { 'richContent': this.getEmptyFormulaDto() });
        break;
      case 'Quantity':
        this.dataTypes.push(this.quantity = { 'quantity': this.getEmptyFormulaDto() });
        break;
      case 'Liste':
        this.dataTypes.push(this.list = { 'list': this.getEmptyFormulaDto() });
        break;
    }
    console.log(this.dataTypes)
  }


  // onOptionClick(option: string) {
  //   this.dataTypes.push(option)
  // }
  deleteObject(index: number) {
    this.dataTypes.splice(index, 1);
    this.isExpanded.splice(index,1);
  }

  toggleCard(index: number) {
    this.isExpanded[index] = !this.isExpanded[index]
    console.log('isExpanded in Data',this.isExpanded )
  }
}
