import {Component, Input, OnInit} from '@angular/core';

import { SoftwareDto } from 'src/app/generated/dcc/model/softwareDto';
import { InitializationService } from 'src/app/services/dcc/initialization.service';

@Component({
  selector: 'app-dcc-software',
  templateUrl: './dcc-software.component.html',
  styleUrls: ['./dcc-software.component.scss']
})
export class DccSoftwareComponent implements OnInit {
  @Input() list: SoftwareDto[];
  isExpanded: boolean[] = [true];

  constructor(private initializationService: InitializationService) {
    this.list = new Array<SoftwareDto>;
    this.addEmptySoftwareDto();
    this.addExpanded();
  }

  ngOnInit(): void {
  }

  addEmptySoftwareDto() {
    this.list.push(this.initializationService.getEmptySoftwareDto());
  }

  toggleCard(index: number) {
    this.isExpanded[index]=!this.isExpanded[index];
  }

  addExpanded() {
    this.isExpanded.push(true);
  }
}
