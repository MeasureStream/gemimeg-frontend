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

import { DataDto } from "src/app/generated/dcc/model/dataDto";
import { InitializationService } from "src/app/services/dcc/initialization.service";

@Component({
  selector: "app-dcc-data",
  templateUrl: "./dcc-data.component.html",
  styleUrls: ["./dcc-data.component.scss"],
})
export class DccDataComponent implements OnInit {
  @Input() dataTypes!: DataDto[];
  @Input() idPrefix!: string;
  selectedOption: string = "richContent";
  options: string[] = ["richContent", "formula", "byteData", "quantity", "list"];
  isExpanded: boolean[] = [];

  constructor(private initializationService: InitializationService) {}

  ngOnInit(): void {
  }

  onSelectionChange(event: any) {
    this.selectedOption = event.value;
  }

  addObject(option: string) {
    switch (option) {
      case "byteData":
        var item = this.initializationService.getEmptyDataDto();
        item.byteData = this.initializationService.getEmptyByteDataDto();
        this.dataTypes.push(item);
        break;
      case "formula":
        var item = this.initializationService.getEmptyDataDto();
        item.formula = this.initializationService.getEmptyFormulaDto();
        this.dataTypes.push(item);
        break;
      case "richContent":
        var item = this.initializationService.getEmptyDataDto();
        item.richContent = this.initializationService.getEmptyRichContentDto();
        this.dataTypes.push(item);
        break;
      case "quantity":
        var item = this.initializationService.getEmptyDataDto();
        item.quantity = this.initializationService.getEmptyQuantityDto();
        this.dataTypes.push(item);
        break;
      case "list":
        var item = this.initializationService.getEmptyDataDto();
        item.list = this.initializationService.getEmptyListDto();
        this.dataTypes.push(item);
        break;
    }
  }

  deleteObject(index: number) {
    this.dataTypes.splice(index, 1);
    this.isExpanded.splice(index, 1);
  }

  toggleCard(index: number) {
    this.isExpanded[index] = !this.isExpanded[index];
  }
}
