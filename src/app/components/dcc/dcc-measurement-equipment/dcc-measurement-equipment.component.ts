import { Component, Input, OnInit } from '@angular/core';

import { EquipmentDto } from 'src/app/generated/dcc/model/equipmentDto';
import { InitializationService } from 'src/app/services/dcc/initialization.service';

@Component({
  selector: 'app-dcc-measurement-equipment',
  templateUrl: './dcc-measurement-equipment.component.html',
  styleUrls: ['./dcc-measurement-equipment.component.scss']
})
export class DccMeasurementEquipmentComponent implements OnInit {

  @Input() list: Array<EquipmentDto>;
  isExpanded:boolean[] = [true];

  constructor(private initializationService: InitializationService) {
    this.list = new Array<EquipmentDto>;
    this.addEmptyEquipmentDto();
    this.addExpanded();
  }

  ngOnInit(): void {
  }
  
  toggleCard(index: number) {
    this.isExpanded[index] = !this.isExpanded[index];
  }
  
  addExpanded() {
    this.isExpanded.push(true)
  }

  addEmptyEquipmentDto() {
    this.list.push(this.initializationService.getEmptyEquipmentDto());
  }
}
