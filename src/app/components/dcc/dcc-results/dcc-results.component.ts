import { Component, Input, OnInit } from '@angular/core';

import { ResultDto } from 'src/app/generated/dcc/model/resultDto';
import { InitializationService } from 'src/app/services/dcc/initialization.service';

@Component({
  selector: 'app-dcc-results',
  templateUrl: './dcc-results.component.html',
  styleUrls: ['./dcc-results.component.scss']
})
export class DccResultsComponent implements OnInit {
  @Input() list: Array<ResultDto>;
  isExpanded: boolean[] = [true];

  constructor(private initializationService: InitializationService) {
    this.list = new Array<ResultDto>;
    this.addEmptyResultDto();
    this.addExpanded();
  }

  ngOnInit(): void {
  }
  
  addExpanded() {
    this.isExpanded.push(true);
  }

  addEmptyResultDto() {
    this.list.push(this.initializationService.getEmptyResultDto());
  }
}
