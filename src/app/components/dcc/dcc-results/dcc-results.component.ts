import { Component, Input, OnInit, ChangeDetectorRef, SimpleChanges } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { DimensionDto } from "src/app/generated/dcc/model/dimensionDto";
import { QuantityDto } from "src/app/generated/dcc/model/quantityDto";
import { ResultDto } from "src/app/generated/dcc/model/resultDto";
import { ExpandedUncDto } from "src/app/generated/dcc/model/expandedUncDto";
import { HybridValues } from "src/app/generated/dcc/model/hybridValues";

@Component({
  selector: "app-dcc-results",
  templateUrl: "./dcc-results.component.html",
  styleUrls: ["./dcc-results.component.scss"],
})
export class DccResultsComponent implements OnInit {
  @Input() list: Array<ResultDto> | any;
  displayedColumns: string[] = ["position", "name", "weight", "symbol"];
  validRestrictions = ["beforeAdjustment", "afterAdjustment", "beforeRepair", "afterRepair"];
  isExpanded: boolean[] = [true];
  dimensions: DimensionDto[] = [];
  selectedOption: string = "";
  value: string[] = [];
  unit: string[] = [];
  displayedColumn: string[] = ["index", "value", "unit"];
  dataSource: DimensionDto[] = [];

  newValue: string = "";
  newUnit: string = "";

  uncertainty: string[] = [];
  coverageFactor: string[] = [];
  coverageProbability: string[] = [];

  showExpandedUncertainty: boolean[] = [false];

  addedData: Array<{ refType: string; value: string; unit: string }> = [];

  constructor(private logger: NGXLogger, private cd: ChangeDetectorRef) {
    this.dataSource = [];
  }
  newData = {
    refType: "",
    value: "",
    unit: "",
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["list"] && this.list?.length) {
      this.processData();

      this.dataSource = this.dimensions.map((dimension: any, index: number) => ({
        index: index + 1,
        value: dimension.value || 0,
        unit: dimension.unit || "N/A",
      }));
    }
  }

  ngOnInit(): void {
    if (!this.list || this.list.length === 0) {
      return;
    }
    // this.wrappedResults = { data: this.results.data };

    this.processData();
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  private processData(): void {
    if (!this.list || this.list.length === 0) {
      return;
    }

    this.dimensions = [];

    this.list.forEach((dataEntry: any) => {
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

  removeRow(HybridValues: HybridValues | any, index: number): void {
    HybridValues.dimensions.splice(index, 1);
  }

  addNewRow(HybridValues: any): void {
    if (!this.newValue || !this.newUnit) {
      alert("Please enter both Value and Unit");
      return;
    }

    HybridValues.dimensions.push({
      value: +this.newValue,
      unit: this.newUnit,
    });

    HybridValues.quantitySubTypeNames.push("realListXMLList");

    this.newValue = "";
    this.newUnit = "";
  }

  toggleExpandedUncertainty(index: number) {
    this.showExpandedUncertainty[index] = !this.showExpandedUncertainty[index];
  }

  /*  concatenateValuesAndUnits(): void {
    if (!this.list?.length) {
      return;
    }

    const values: string[] = [];
    const unitsSet: string[] = [];

    this.list.forEach((dataEntry: any) => {
      dataEntry.data[0]?.list?.quantities?.forEach((quantity: any) => {
        let value_temp = '';
        let unit_temp = '';
        quantity.hybridValues?.dimensions?.forEach((dim: any) => {
          value_temp = value_temp + ' ' + dim.value.toString();
          unit_temp = unit_temp + ' ' + dim.unit;
        });
        values.push(value_temp);
        unitsSet.push(unit_temp);
      });
    });

    this.value = values;
    this.unit = unitsSet;

    const uncertaintys: string[] = [];
    const coverageFactors: string[] = [];
    const coverageProbabilitys: string[] = [];

    this.list.forEach((dataEntry: any) => {
      dataEntry.data[0]?.list?.quantities?.forEach((quantity: any) => {
        let uncertainty_temp = '';
        let coverageFactor_temp = '';
        let coverageProbability_temp = '';
        quantity.hybridValues?.uncertaintyList?.forEach((dim: any) => {
          uncertainty_temp = uncertainty_temp + ' ' + dim.uncertainty.toString();
          coverageFactor_temp = coverageFactor_temp + ' ' + dim.coverageFactor.toString();
          coverageProbability_temp = coverageProbability_temp + ' ' + dim.coverageProbability.toString();
        });
        if (uncertainty_temp && coverageFactor_temp && coverageProbability_temp) {
          uncertaintys.push(uncertainty_temp);
          coverageFactors.push(coverageFactor_temp);
          coverageProbabilitys.push(coverageProbability_temp);
        }
      });
    });

    this.uncertainty = uncertaintys;
    this.coverageFactor = coverageFactors;
    this.coverageProbability = coverageProbabilitys;
  } */

  /*  onValueUnitChange(newValue: string, index: number, column: 'value' | 'unit'): void {
    if (!this.list?.length || !this.dataSource?.[index]) {
      return;
    }

    if (!this.list[index]) {
      this.list[index] = { value: '', unit: '' };
    }

    this.list[index][column] = newValue ?? '';

    const valueArray = (this.list[index].value || '')
      .toString()
      .split(' ')
      .map((val: any) => val.trim())
      .filter((val: any) => val !== '')
      .map((val: any) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      });

    const unitArray = (this.list[index].unit || '')
      .toString()
      .split(' ')
      .map((unit: any) => unit.trim())
      .filter((unit: any) => unit !== '');

    if (valueArray.length === unitArray.length) {
      let quantities_temp: DimensionDto[] = [];

      for (let i = 0; i < unitArray.length; i++) {
        quantities_temp.push({
          value: valueArray[i],
          unit: unitArray[i],
        });
      }

      this.list.forEach((dataEntry: any) => {
        const quantities = dataEntry.data?.[0]?.list?.quantities;
        if (quantities && quantities[index]) {
          const quantity = quantities[index];

          if (quantity.hybridValues?.dimensions) {
            quantity.hybridValues.dimensions = quantities_temp;
          }
          if (quantity.hybridValues?.quantitySubTypeNames) {
            const diff = valueArray.length - quantity.hybridValues?.quantitySubTypeNames.length;
            for (let i = 0; i < diff; i++) {
              quantity.hybridValues?.quantitySubTypeNames.push('realListXMLList');
            }
          }
        }
      });
    }
  } */

  onUncertainityChange(newUnit: string, index: number): void {
    if (!this.list?.length) {
      return;
    }

    const uncertaintyArray = this.uncertainty[index]
      .split(" ")
      .map((val) => val.trim())
      .filter((val) => val !== "")
      .map((val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      });

    const coverageFactorArray = this.coverageFactor[index]
      .split(" ")
      .map((val) => val.trim())
      .filter((val) => val !== "")
      .map((val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      });

    const coverageProbabilityArray = this.coverageProbability[index]
      .split(" ")
      .map((val) => val.trim())
      .filter((val) => val !== "")
      .map((val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      });

    if (uncertaintyArray.length === coverageFactorArray.length && uncertaintyArray.length === coverageProbabilityArray.length) {
      let quantities_temp: ExpandedUncDto[] = [];

      for (let i = 0; i < uncertaintyArray.length; i++) {
        quantities_temp.push({
          uncertainty: uncertaintyArray[i],
          coverageFactor: coverageFactorArray[i],
          coverageProbability: coverageProbabilityArray[i],
        });
      }

      this.list.forEach((dataEntry: any) => {
        const quantities = dataEntry.data[0].list?.quantities;

        if (quantities) {
          quantities.forEach((quantity: any) => {
            if (quantity.hybridValues?.uncertaintyList) {
              quantity.hybridValues.uncertaintyList = quantities_temp;
            }
          });
        }
      });
    }
  }

  getEmptyResultDto(): ResultDto {
    var result = <QuantityDto>{};

    result.refTypes = new Array<string>();
    result.name = {
      content: [
        {
          lang: "de",
          text: "",
        },
        {
          lang: "en",
          text: "",
        },
      ],
    };

    result.quantityTypeName = "hybrid";
    result.hybridValues = {
      dimensions: [
        {
          value: 0,
          unit: "",
        },
      ],
      quantitySubTypeNames: ["realListXMLList"],
    };

    // result.data[0].quantity = <QuantityDto>{};
    // result.data[0].quantity.hybridValues = <HybridValues>{};
    // result.data[0].quantity.hybridValues.dimensions = new Array<DimensionDto>;
    // result.data[0].quantity.hybridValues.quantitySubTypeNames = [''];
    return result;
  }

  onRefTypeChange(event: any, refTypes: any) {
    refTypes.refTypes = [event];
  }

  mergeData() {
    const mergedData = {
      ...this.list,
      value: this.value,
      unit: this.unit,
    };
    console.log("Merged Data:", mergedData);
  }

  addData() {
    this.addedData.push({ ...this.newData });

    this.newData = {
      refType: "",
      value: "",
      unit: "",
    };
  }
  toggleCard(index: number) {
    this.isExpanded[index] = !this.isExpanded[index];
  }

  deleteQuantity(quantity: QuantityDto[], itemIndex: number): void {
    if (quantity[itemIndex]) {
      quantity.splice(itemIndex, 1);
    }
  }
}
