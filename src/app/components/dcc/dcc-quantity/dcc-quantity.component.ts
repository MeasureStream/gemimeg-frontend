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

import { Component, Input, OnInit, ChangeDetectorRef, SimpleChanges } from "@angular/core";
import { DataDto } from "src/app/generated/dcc/model/dataDto";
import { ConditionDto } from "src/app/generated/dcc/model/conditionDto";
import { InitializationService } from "src/app/services/dcc/initialization.service";
import { QuantityDto } from "src/app/generated/dcc/model/quantityDto";
import { DimensionDto } from "src/app/generated/dcc/model/dimensionDto";

export interface UnifiedQuantityEntry {
  quantity: QuantityDto;
  originIndex: number;
  source: "single" | "list"; // NEW
  component?: string;
}
@Component({
  selector: "app-dcc-quantity",
  templateUrl: "./dcc-quantity.component.html",
  styleUrls: ["./dcc-quantity.component.scss"],
})
export class DccQuantityComponent implements OnInit {
  @Input() item: ConditionDto | any;
  @Input() i: number = 0;
  isExpanded: boolean[] = [true];
  isExpandedQuantity: boolean[] = [false];
  validRestrictions = ["beforeAdjustment", "afterAdjustment", "beforeRepair", "afterRepair"];
  isReal: boolean[] = [];

  date: string = "";
  newValue: string = "";
  newUnit: string = "";
  unit: string = "";
  value: string = "";
  label: string = "";
  english: string = "";
  german: string = "";
  dimensions: DimensionDto[] = [];
  quantity: any;
  dataSource: DimensionDto[] = [];
  showExpandedUncertainty: boolean[] = [false];
  newUncertaintyEntry: { [key: number]: any } = {};

  constructor(private initializationService: InitializationService, private cd: ChangeDetectorRef) {
    this.item = <ConditionDto>{};
    this.addEmptyConditionDto();
    this.dataSource = [];
  }

  unifiedQuantities: UnifiedQuantityEntry[] = [];

  ngOnInit() {
    this.updateUnifiedQunatities();
    this.newUncertaintyEntry = {};
  }

  updateUnifiedQunatities() {
    this.unifiedQuantities = [];
    if (this.item?.data?.length > 0) {
      this.item.data.forEach((dataItem: DataDto, index: number) => {
        // Check for hybrid "real" quantity first
        if (dataItem.quantity?.hybridValues?.quantitySubTypeNames?.includes("real")) {
          this.unifiedQuantities.push({
            quantity: dataItem.quantity,
            originIndex: index,
            source: "single",
          });
          this.isReal.push(true); // it's a real quantity
        }
        else if (dataItem.list?.quantities?.length) {
          dataItem.list.quantities.forEach((q: QuantityDto) => {
            const isRealList = q?.hybridValues?.quantitySubTypeNames?.includes("realListXMLList");

            if (isRealList) {
              this.unifiedQuantities.push({
                quantity: q,
                originIndex: index,
                source: "list",
              });
              this.isReal.push(false); // it's a realListXMLList quantity
            }
          });
        }
      });
    } else {
      this.item.forEach((quantity: any, index: number) => {
        this.unifiedQuantities.push({
          quantity: quantity.quantity,
          originIndex: index,
          source: "single",
        });
        this.isReal.push(true); // it's a real quantity
      });
    }
  }

  toggleExpandedUncertainty(index: number) {
    this.showExpandedUncertainty[index] = !this.showExpandedUncertainty[index];
  }

  addNewUncertaintyEntry(item: any, quantityIndex: number): void {
    if (!this.newUncertaintyEntry[quantityIndex]) {
      this.newUncertaintyEntry[quantityIndex] = {};
    }
    const entry = this.newUncertaintyEntry[quantityIndex];
    if (entry.uncertainty || entry.coverageFactor || entry.coverageProbability) {
      const list = item.data?.[0]?.list?.quantities?.[quantityIndex]?.hybridValues?.expandedUncList;
      if (list) {
        list.push({
          uncertainty: entry.uncertainty || "",
          coverageFactor: entry.coverageFactor || "",
          coverageProbability: entry.coverageProbability || "",
        });
        this.newUncertaintyEntry[quantityIndex] = {};
      }
    }
  }

  removeUncertaintyEntry(item: any, quantityIndex: number, entryIndex: number): void {
    const list = item.data?.[0]?.list?.quantities?.[quantityIndex]?.hybridValues?.expandedUncList;
    if (list && list.length > entryIndex) {
      list.splice(entryIndex, 1);
    }
  }

  addEmptyConditionDto(): ConditionDto {
    return this.initializationService.getEmptyConditionDto();
  }

  toggleCardQuantity(index: number) {
    this.isExpandedQuantity[index] = !this.isExpandedQuantity[index];
  }

  addRefType(refTypes: any) {
    if (!refTypes) {
      refTypes = { refTypes: [] };
    }
    refTypes.push("");
  }

  removeRefType(refTypes: any, index: number) {
    if (refTypes && refTypes.length > 1) {
      refTypes.splice(index, 1);
    }
  }

  onInputChange(event: Event, index: number, refTypes: any) {
    const inputElement = event.target as HTMLInputElement;
    refTypes[index] = inputElement.value;
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  getSubType(data: DataDto | any) {
    if (data[0] === "real") {
      return "real";
    }
    return "realListXML";
  }

  removeRow(item: any) {
    if (typeof item?.data?.[0]?.quantity === "object") {
      // Case: "real" quantity in item.data[]
      const index = item.data.findIndex(
        (entry: any) => entry.quantity?.refTypes?.[0] === this.label && entry.quantity?.hybridValues?.quantitySubTypeNames?.includes("real")
      );

      if (index > -1) {
        item.data.splice(index, 1);
      }
    } else if (Array.isArray(item?.data?.[0]?.list?.quantities)) {
      const quantities = item.data[0].list.quantities;
      const index = quantities.findIndex((q: any) => q?.refTypes?.[0] === this.label && q?.hybridValues?.quantitySubTypeNames?.includes("realListXMLList"));
      if (index > -1) {
        quantities.splice(index, 1);
      }
    } else {
      const index = item.findIndex(
        (entry: any) => entry.quantity?.refTypes?.[0] === this.label && entry.quantity?.hybridValues?.quantitySubTypeNames?.includes("real")
      );
      if (index > -1) {
        item.splice(index, 1);
      }
    }
    this.updateUnifiedQunatities();
  }

  addNewRow(HybridValues: any): void {
    if (!this.newValue || !this.newUnit) {
      alert("Please enter both Value and Unit");
      return;
    }
    HybridValues.dimensions = HybridValues.dimensions || [];
    HybridValues.quantitySubTypeNames = HybridValues.quantitySubTypeNames || [];
    HybridValues.dimensions.push({
      value: +this.newValue,
      unit: this.newUnit,
    });
    if (this.unifiedQuantities[0].source === "single") {
      HybridValues.quantitySubTypeNames.push("real");
    } else {
      HybridValues.quantitySubTypeNames.push("realListXMLList");
    }
    this.newValue = "";
    this.newUnit = "";
  }

  saveRealListXML(item: any) {
    const units = this.unit.split(" ");
    const values = this.value.split(" ");
    const dimension = [];
    const subTypeName = [];
    for (let i = 0; i < units.length; i++) {
      dimension.push({
        value: values[i],
        unit: units[i],
      });
      subTypeName.push("realListXMLList");
    }
    item.dimensions = dimension;
    item.quantitySubTypeNames = subTypeName;
  }

  saveRealData(item: any) {
    if (typeof item?.data?.[0]?.quantity === "object") {
      item.data.push({
        quantity: {
          refTypes: [this.label],
          name: {
            content: [
              {
                lang: "de",
                text: this.german,
              },
              {
                lang: "en",
                text: this.english,
              },
            ],
          },
          quantityTypeName: "hybrid",
          hybridValues: {
            dimensions: [
              {
                value: this.value,
                unit: this.unit,
                date: this.date,
              },
            ],
            quantitySubTypeNames: ["real"],
          },
        },
      });
    } else if (Array.isArray(item?.data?.[0]?.list?.quantities)) {
      const units = this.unit.split(" ");
      const values = this.value.split(" ");
      const dimension = [];
      const subTypeName = [];
      for (let i = 0; i < units.length; i++) {
        dimension.push({
          value: values[i],
          unit: units[i],
        });
        subTypeName.push("realListXMLList");
      }
      item.data[0].list?.quantities.push({
        refTypes: [this.label],
        name: {
          content: [
            {
              lang: "de",
              text: this.german,
            },
            {
              lang: "en",
              text: this.english,
            },
          ],
        },
        quantityTypeName: "hybrid",
        hybridValues: {
          dimensions: dimension,
          quantitySubTypeNames: subTypeName,
        },
      });
    } else {
      console.log("Statement case", item);

      item.push({
        quantity: {
          refTypes: [this.label],
          name: {
            content: [
              {
                lang: "de",
                text: this.german,
              },
              {
                lang: "en",
                text: this.english,
              },
            ],
          },
          quantityTypeName: "hybrid",
          hybridValues: {
            dimensions: [
              {
                value: this.value,
                unit: this.unit,
                date: this.date,
              },
            ],
            quantitySubTypeNames: ["real"],
          },
        },
      });
    }

    this.updateUnifiedQunatities();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["list"] && this.item?.length) {
      this.processData();

      this.dataSource = this.dimensions.map((dimension: any, index: number) => ({
        index: index + 1,
        value: dimension.value || 0,
        unit: dimension.unit || "N/A",
      }));
    }

    if (changes["item"]) {
      this.updateUnifiedQunatities();
    }
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  private processData(): void {
    if (!this.item || this.item.length === 0) {
      return;
    }
    this.dimensions = [];
    this.item.forEach((dataEntry: any) => {
      if (!dataEntry.data || !Array.isArray(dataEntry.data) || !dataEntry.data[0].list?.quantities) {
        return;
      }
      dataEntry.data[0].list.quantities.forEach((quantity: any) => {
        if (quantity.hybridValues?.dimensions) {
          this.dimensions.push(...quantity.hybridValues.dimensions);
        }
      });
    });
    if (this.dimensions.length === 0) {
      console.warn("No dimensions found!");
    }
    this.dataSource = this.dimensions.map((dimension: any, index: number) => ({
      index: index + 1,
      value: dimension.value || 0,
      unit: dimension.unit || "N/A",
    }));
    this.cd.detectChanges();
  }

  getDimensions(entry: UnifiedQuantityEntry, index: number): DimensionDto[] {
    const hybridValues = entry.quantity?.hybridValues;
    if (!hybridValues || !Array.isArray(hybridValues.dimensions)) {
      return [];
    }
    if (this.isReal[index]) {
      return hybridValues.dimensions;
    }
    if (!Array.isArray(hybridValues.quantitySubTypeNames)) {
      return [];
    }
    return hybridValues.dimensions.filter((_, i) => hybridValues.quantitySubTypeNames![i] === "realListXMLList");
  }
}
