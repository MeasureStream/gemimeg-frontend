import { Component, Input, OnInit } from '@angular/core';

import { MethodDto } from 'src/app/generated/dcc/model/methodDto';
import { InitializationService } from 'src/app/services/dcc/initialization.service';

@Component({
  selector: 'app-dcc-used-methods',
  templateUrl: './dcc-used-methods.component.html',
  styleUrls: ['./dcc-used-methods.component.scss']
})
export class DccUsedMethodsComponent implements OnInit {

  @Input() list: Array<MethodDto>;
  isExpanded: boolean[] = [true];

  constructor(private initializationService: InitializationService) {
    this.list = new Array<MethodDto>;
    this.addEmptyMethodDto();
    this.addExpanded();
  }

  ngOnInit(): void {
  }

  addEmptyMethodDto() {
    this.list.push(this.initializationService.getEmptyMethodDto());
  }

  toggleCard(index:number) {
    this.isExpanded[index]=!this.isExpanded[index];
  }

  addExpanded() {
    this.isExpanded.push(true);
  }
}
