import { Component, Input, OnInit } from '@angular/core';

import { QuantityDto } from 'src/app/generated/dcc/model/quantityDto';
import { InitializationService } from 'src/app/services/dcc/initialization.service';

@Component({
  selector: 'app-dcc-quantity',
  templateUrl: './dcc-quantity.component.html',
  styleUrls: ['./dcc-quantity.component.scss']
})
export class DccQuantityComponent implements OnInit {
  @Input() dataType: QuantityDto | any;

  constructor(initializationService: InitializationService) {
    this.dataType = initializationService.getEmptyQuantityDto();
  }

  ngOnInit(): void {
  }
}
