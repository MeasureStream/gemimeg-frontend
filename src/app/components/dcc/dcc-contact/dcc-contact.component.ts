import { Component, Input, OnInit } from '@angular/core';

import { ContactDto } from 'src/app/generated/dcc/model/contactDto';
import { InitializationService } from 'src/app/services/dcc/initialization.service';

@Component({
  selector: 'app-dcc-contact, [app-dcc-contact]',
  templateUrl: './dcc-contact.component.html',
  styleUrls: ['./dcc-contact.component.scss']
})
export class DccContactComponent implements OnInit {
  @Input() contact: ContactDto;
  @Input() strict: boolean;

  constructor(initializationService: InitializationService) {
    this.strict = true;
    this.contact = initializationService.getEmptyContactDto();
  }

  ngOnInit(): void {
  }
}
