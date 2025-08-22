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
import { Component, Input, OnInit } from "@angular/core";

import { StatementDto } from "src/app/generated/dcc/model/statementDto";
import { DccService } from "src/app/services/dcc/dcc.service";
import { InitializationService } from "src/app/services/dcc/initialization.service";

@Component({
  selector: "app-dcc-measurement-metadata",
  templateUrl: "./dcc-measurement-metadata.component.html",
  styleUrls: ["./dcc-measurement-metadata.component.scss"],
})
export class DccMeasurementMetadataComponent implements OnInit {
  @Input() list: Array<StatementDto>;
  @Input() idPrefix!: string;
  @Input() header: string;

  item = { date: "" };
  statementDate: Date | any = "2022-09-09";
  startDate = new Date(2024, 1, 1);
  validConformityStatementStatusTypes = ["pass", "fail", "conditionalPass", "conditionalFail", "noPass", "noFail"];

  isExpanded: boolean[] = [true];

  constructor(public dccService: DccService, private initializationService: InitializationService) {
    this.list = new Array<StatementDto>();
    this.addEmptyStatementDto();
    this.addExpanded();
    this.header = "";
  }

  ngOnInit(): void {}

  string2Arr(event: Event, fieldName: keyof StatementDto, index: number) {
    const input = (event.target as HTMLInputElement).value;
    const statement = this.list[index] as StatementDto;
    if (statement[fieldName] !== undefined) {
      const processedArray = input.split(",").map((code) => code.trim());
      if (fieldName === "countryCodes") {
        (statement[fieldName] as string[]) = processedArray.filter((code) => code !== "").map((code) => code.toUpperCase());
      } else {
        (statement[fieldName] as string[]) = processedArray.filter((code) => code !== "");
      }
    }
  }

  marshalCustomDate(value: Date): string {
    const result = new Array<string>();
    if (value) {
      result.push(value.getFullYear().toString());
      result.push((value.getMonth() + 1).toString());
      result.push(value.getDate().toString());
    }
    for (let i = 0; i < result.length; i++) {
      if (result[i].length === 1) {
        result[i] = "0" + result[i];
      }
    }
    return result[0] + "-" + result[1] + "-" + result[2];
  }

  toggleCard(index: number) {
    this.isExpanded[index] = !this.isExpanded[index];
  }

  addEmptyStatementDto() {
    this.list.push(this.initializationService.getEmptyStatementDto());
  }

  addExpanded() {
    this.isExpanded.push(true);
  }

  onDateChange(event: any) {
    const date: Date = event.value;
    this.item.date = this.marshalCustomDate(date);
  }
}
