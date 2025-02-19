import { Injectable } from '@angular/core';
import { ConditionDto } from 'src/app/generated/dcc/model/conditionDto';
import { DataDto } from 'src/app/generated/dcc/model/dataDto';
import { DimensionDto } from 'src/app/generated/dcc/model/dimensionDto';
import { HybridValues } from 'src/app/generated/dcc/model/hybridValues';
import { QuantityDto } from 'src/app/generated/dcc/model/quantityDto';

@Injectable({
  providedIn: 'root'
})
export class InitializationService {

  constructor() { }

  getEmptyDimensionDto(): DimensionDto {
    var result = <DimensionDto>{};
    result.value = 0;
    result.unit = '';
    return result;
  }

  getEmptyHybridValues(): HybridValues {
    var result = <HybridValues>{};
    result.dimensions = new Array<DimensionDto>;
    result.dimensions.push(this.getEmptyDimensionDto());
    return result;
  }

  getEmptyQuantityDto(): QuantityDto {
    var result = <QuantityDto>{};
    result.id = '';
    result.refIds = [];
    result.refTypes = [];
    result.label = '';
    result.dimension = this.getEmptyDimensionDto();
    result.quantityTypeName = 'real';
    result.hybridValues = this.getEmptyHybridValues();
    return result;
  }

  getEmptyDataDto(): DataDto {
    var result = <DataDto>{};
    result.id = '';
    result.refIds = [];
    result.refTypes = [];
    result.quantity = this.getEmptyQuantityDto();
    return result;
  }

  getEmptyConditionDto(): ConditionDto {
    var result = <ConditionDto>{};
    result.id = '';
    result.refIds = [];
    result.refTypes = [];
    result.data = new Array<DataDto>;
    result.data.push(this.getEmptyDataDto());
    result.status = '';
    return result;
  }
}
