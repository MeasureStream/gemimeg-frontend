/**
 *  Copyright 2025 Physikalisch-Technische Bundesanstalt
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *
 *  1. Redistributions of source code must retain the above copyright notice,
 *  this list of conditions and the following disclaimer.
 *
 *  2. Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation
 *  and/or other materials provided with the distribution.
 *
 *  3. Neither the name of the copyright holder nor the names of its contributors
 *  may be used to endorse or promote products derived from this software without
 *  specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS” AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 *  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 *  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 *  BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 *  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 *  OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 *  OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { ByteDataDto } from "src/app/generated/dcc/model/byteDataDto";
import { ContactDto } from "src/app/generated/dcc/model/contactDto";
import { InitializationService } from "src/app/services/dcc/initialization.service";

@Component({
  selector: "app-dcc-contact, [app-dcc-contact]",
  templateUrl: "./dcc-contact.component.html",
  styleUrls: ["./dcc-contact.component.scss"],
})
export class DccContactComponent implements OnInit, OnChanges {
  private _contact: ContactDto;
  private _showLocation = false;
  @Input() parent: string = "";
  @Input() strict: boolean;
  @Input() idPrefix!: string;
  @Output() fileSelected = new EventEmitter<ByteDataDto>();

  @Input() set contact(value: ContactDto) {
    this._contact = value;
    this.checkLocationFields();
  }

  constructor(private initializationService: InitializationService) {
    this._contact = this.initializationService.getEmptyContactDto();
    this.strict = true;
  }
  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {}

  onFileSelected(fileData: ByteDataDto) {
    this.fileSelected.emit(fileData);
  }

  checkLocationFields() {
    if (this.parent === "manufacturer") {
      const location = this._contact.location;
      const locationFields = [
        location?.city,
        location?.countryCode,
        location?.postalCode,
        location?.stateCode,
        location?.street,
        location?.houseNumber,
        location?.poBox,
      ];
      let hasLocationField = locationFields.some((fieldValue) => fieldValue?.toString().trim());
      let further = location?.additionalInformation;
      let hasNameContent: boolean = false;
      let hasTextContent: boolean = false;
      hasNameContent = further?.name?.content?.some((entry) => typeof entry?.text === "string" && entry.text.trim() !== "") ?? false;
      hasTextContent = further?.textContent?.content?.some((entry) => typeof entry?.text === "string" && entry.text.trim() !== "") ?? false;
      this.showLocation = hasLocationField || hasNameContent || hasTextContent;
    }
  }
  get showLocation(): boolean {
    return this._showLocation;
  }
  set showLocation(value: boolean) {
    this._showLocation = value;
    if (value === false) {
      this._contact.location = this.initializationService.getEmptyLocationDto();
    }
  }
  get contact(): ContactDto {
    return this._contact;
  }
}
