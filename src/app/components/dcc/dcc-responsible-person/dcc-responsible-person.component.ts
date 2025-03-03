import { Component, Input } from '@angular/core';

import { ContactDto } from 'src/app/generated/dcc/model/contactDto';
import { InitializationService } from 'src/app/services/dcc/initialization.service';


@Component({
  selector: 'app-dcc-responsible-person',
  templateUrl: './dcc-responsible-person.component.html',
  styleUrls: ['./dcc-responsible-person.component.scss']
})
export class DccResponsiblePersonComponent {
  @Input() list: Array<ContactDto>;
  isExpanded: boolean[] = [true];

  constructor(private initializationService: InitializationService) {
    this.list = new Array<ContactDto>;
    this.addEmptyContactDto();
    this.addExpanded();
  }

  ngOnInit(): void {
  }

  toggleCard(index: number) {
    this.isExpanded[index]=!this.isExpanded[index];
  }
  
  addExpanded() {
    this.isExpanded.push(true);
  }

  addEmptyContactDto() {
    this.list.push(this.initializationService.getEmptyContactDto());
  }
}
