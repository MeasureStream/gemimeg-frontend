import { Component, Input, OnInit } from '@angular/core';

import { LanguageSpecificStringsDto } from 'src/app/generated/dcc/model/languageSpecificStringsDto';
import { DataDto } from 'src/app/generated/dcc/model/dataDto';
import { DimensionDto } from 'src/app/generated/dcc/model/dimensionDto';
import { QuantityDto } from 'src/app/generated/dcc/model/quantityDto';
import { ResultDto } from 'src/app/generated/dcc/model/resultDto';
import { LangTextPair } from 'src/app/generated/dcc/model/langTextPair';

@Component({
  selector: 'app-dcc-results',
  templateUrl: './dcc-results.component.html',
  styleUrls: ['./dcc-results.component.scss']
})
export class DccResultsComponent implements OnInit {
  @Input() list: Array<ResultDto>;

  constructor() {
    this.list = new Array<ResultDto>;
  }

  ngOnInit(): void {

  }

  getEmptyResultDto(): ResultDto {
    var result = <ResultDto>{};
    result.name = <LanguageSpecificStringsDto>{};
    result.name.content = new Array<LangTextPair>;
    result.name.content.push(<LangTextPair>{})
    result.data = new Array<DataDto>;
    result.data.push(<DataDto>{});
    result.data[0].quantity = <QuantityDto>{}
    result.data[0].quantity.dimension = <DimensionDto>{};
    return result;
  }
}
