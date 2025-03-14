import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { ByteDataDto } from 'src/app/generated/dcc/model/byteDataDto';
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
  @Output() fileSelected = new EventEmitter<ByteDataDto>();

  constructor(initializationService: InitializationService) {
    this.strict = true;
    this.contact = initializationService.getEmptyContactDto();
  }

  onFileSelected(fileData: ByteDataDto) {
    this.fileSelected.emit(fileData);
  }

  ngOnInit(): void {
  }
}
