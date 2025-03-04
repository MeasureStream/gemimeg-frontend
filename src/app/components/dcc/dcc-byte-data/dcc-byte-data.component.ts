import { Component, Input } from '@angular/core';

import { ByteDataDto } from 'src/app/generated/dcc/model/byteDataDto';

@Component({
  selector: 'app-dcc-byte-data',
  templateUrl: './dcc-byte-data.component.html',
  styleUrls: ['./dcc-byte-data.component.scss']
})
export class DccByteDataComponent {
  @Input() byteData!: ByteDataDto | any;

  constructor() {
  }

  ngOnInit(): void {
  }
}