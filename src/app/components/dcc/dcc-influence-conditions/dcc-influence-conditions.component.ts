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
import { Component, Input, OnInit, ChangeDetectorRef } from "@angular/core";
import { ConditionDto } from "src/app/generated/dcc/model/conditionDto";
import { InitializationService } from "src/app/services/dcc/initialization.service";

@Component({
  selector: "app-dcc-influence-conditions",
  templateUrl: "./dcc-influence-conditions.component.html",
  styleUrls: ["./dcc-influence-conditions.component.scss"],
})
export class DccInfluenceConditionsComponent implements OnInit {
  @Input() list: Array<ConditionDto>;
  isExpanded: boolean[] = [true];
  validRestrictions = ["beforeAdjustment", "afterAdjustment", "beforeRepair", "afterRepair"];
  selectedOption: any;
  showExpandedUncertainty = false;

  constructor(private initializationService: InitializationService, private cdr: ChangeDetectorRef) {
    this.list = new Array<ConditionDto>();
    this.addEmptyConditionDto();
  }

  ngOnInit(): void {
    console.log("The value for influence condition is :", this.list[0]);
  }

  addEmptyConditionDto(): ConditionDto {
    return this.initializationService.getEmptyConditionDto();
  }

  toggleCard(index: number) {
    this.isExpanded[index] = !this.isExpanded[index];
    this.cdr.detectChanges();
  }

  expandedData = {
    valueExpanded: null,
    coverageFactor: null,
    coverageProbability: null,
    distribution: "",
  };

  realData = {
    label: "",
    value: null as number | null,
    unit: "",
    dateTime: "",
    expandedUncertainty: {
      valueExpanded: null as number | null,
      coverageFactor: null as number | null,
      coverageProbability: null as number | null,
      distribution: null as number | null,
    },
  };

  toggleExpandedUncertainty() {
    this.showExpandedUncertainty = !this.showExpandedUncertainty;
  }

  addNewCondition() {
    this.list.push(this.addEmptyConditionDto());
  }
}
