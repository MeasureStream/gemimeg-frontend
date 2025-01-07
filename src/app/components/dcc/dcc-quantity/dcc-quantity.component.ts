import { Component, Input, OnInit } from '@angular/core';

import { NGXLogger } from 'ngx-logger';
import { QuantityDto } from 'src/app/generated/dcc/model/quantityDto';
import { DimensionDto } from 'src/app/generated/dcc/model/dimensionDto';

@Component({
  selector: 'app-dcc-quantity',
  templateUrl: './dcc-quantity.component.html',
  styleUrls: ['./dcc-quantity.component.scss']
})
export class DccQuantityComponent implements OnInit {

  @Input() dataType: QuantityDto;

  constructor(private logger: NGXLogger) {
    this.dataType = <QuantityDto>{};
  }

  ngOnInit(): void {
  }

  getEmptyDataDto() {
    var result = <QuantityDto>{};
    result.dimension = <DimensionDto>{};
    result.quantityTypeName = "REAL";
    return result;
  }

}
