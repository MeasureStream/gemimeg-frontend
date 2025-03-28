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
import { Injectable } from '@angular/core';

import { ByteDataDto } from 'src/app/generated/dcc/model/byteDataDto';
import { CalibrationLaboratoryDto } from 'src/app/generated/dcc/model/calibrationLaboratoryDto';
import { ConditionDto } from 'src/app/generated/dcc/model/conditionDto';
import { ContactDto } from 'src/app/generated/dcc/model/contactDto';
import { CoverageIntervalDto } from 'src/app/generated/dcc/model/coverageIntervalDto';
import { DataDto } from 'src/app/generated/dcc/model/dataDto';
import { DimensionDto } from 'src/app/generated/dcc/model/dimensionDto';
import { EquipmentDto } from 'src/app/generated/dcc/model/equipmentDto';
import { ExpandedMUDto } from 'src/app/generated/dcc/model/expandedMUDto';
import { ExpandedUncDto } from 'src/app/generated/dcc/model/expandedUncDto';
import { FormulaDto } from 'src/app/generated/dcc/model/formulaDto';
import { HybridValues } from 'src/app/generated/dcc/model/hybridValues';
import { IdentificationDto } from 'src/app/generated/dcc/model/identificationDto';
import { ItemDto } from 'src/app/generated/dcc/model/itemDto';
import { LangTextPair } from 'src/app/generated/dcc/model/langTextPair';
import { LanguageSpecificStringsDto } from 'src/app/generated/dcc/model/languageSpecificStringsDto';
import { ListDto } from 'src/app/generated/dcc/model/listDto';
import { LocationDto } from 'src/app/generated/dcc/model/locationDto';
import { MeasurementResultDto } from 'src/app/generated/dcc/model/measurementResultDto';
import { MethodDto } from 'src/app/generated/dcc/model/methodDto';
import { QuantityDto } from 'src/app/generated/dcc/model/quantityDto';
import { ResultDto } from 'src/app/generated/dcc/model/resultDto';
import { RichContentDto } from 'src/app/generated/dcc/model/richContentDto';
import { SoftwareDto } from 'src/app/generated/dcc/model/softwareDto';
import { StatementDto } from 'src/app/generated/dcc/model/statementDto';

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
    result.labelList = [];
    result.quantitySubTypeNames = [];
    result.dimensions = new Array<DimensionDto>;
    result.dimensions.push(this.getEmptyDimensionDto());
    return result;
  }

  getEmptyLanguageSpecificStringsDto(): LanguageSpecificStringsDto {
    var result = <LanguageSpecificStringsDto>{};
    result.id = '';
    result.refIds = [];
    result.content = new Array<LangTextPair>;
    var langTextPair = <LangTextPair>{};
    langTextPair.id = '';
    langTextPair.refIds = [];
    langTextPair.refTypes = [];
    langTextPair.lang = 'en';
    langTextPair.text = '';
    result.content.push(langTextPair);
    return result;
  }

  getLanguageSpecificStringsDto(lang: string, text: string): LanguageSpecificStringsDto {
    var result = this.getEmptyLanguageSpecificStringsDto();
    result.content!.at(0)!.lang = lang;
    result.content!.at(0)!.text = text;
    return result;
  }

  getEmptyExpandedUncDto(): ExpandedUncDto {
    var result = <ExpandedUncDto>{};
    result.uncertainty = 0;
    result.coverageFactor = 1;
    result.coverageProbability = 1;
    result.distribution= '';
    return result;
  }

  getEmptyExpandedMUDto(): ExpandedMUDto {
    var result = <ExpandedMUDto>{};
    result.uncertainty = 0;
    result.coverageFactor = 1;
    result.coverageProbability = 1;
    result.distribution= '';
    return result;
  }

  getEmptyCoverageIntervalDto(): CoverageIntervalDto {
    var result = <CoverageIntervalDto>{};
    result.standardUncertainty = 0;
    result.intervalMinimum = Number.MIN_VALUE;
    result.intervalMaximum = Number.MAX_VALUE;
    result.coverageProbability = 1;
    return result;
  }

  getEmptyQuantityDto(): QuantityDto {
    var result = <QuantityDto>{};
    result.id = '';
    result.refIds = [];
    result.refTypes = [];
    result.dimension = this.getEmptyDimensionDto();
    result.label = '';
    result.quantityTypeName = 'real';
    result.hybridValues = this.getEmptyHybridValues();
    result.expandedUnc = this.getEmptyExpandedUncDto();
    result.expandedMU = this.getEmptyExpandedMUDto();
    result.coverageInterval = this.getEmptyCoverageIntervalDto();
    return result;
  }

  getEmptyRichContentDto(): RichContentDto {
    var result = <RichContentDto>{};
    result.id = '';
    result.refIds = [];
    result.refTypes = [];
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.textContent = this.getEmptyLanguageSpecificStringsDto();
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

  getEmptyByteDataDto(): ByteDataDto {
    var result = <ByteDataDto>{};
    result.id = '';
    result.refIds = [];
    result.description = this.getEmptyRichContentDto();
    result.fileName = '';
    result.mimeType = '';
    result.content = ''; // https://www.rfc-editor.org/rfc/rfc4648#section-10
    return result;
  }

  getEmptyFormulaDto(): FormulaDto {
    var result = <FormulaDto>{};
    result.id = '';
    result.refIds = [];
    result.refTypes = [];
    result.content = '<math></math>';
    result.type = FormulaDto.TypeEnum.Mathml;
    return result;
  }

  getEmptyConditionDto(): ConditionDto {
    var result = <ConditionDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.data = new Array<DataDto>;
    result.data.push(this.getEmptyDataDto());
    return result;
  }

  getEmptyIdentifictionDto(): IdentificationDto {
    var result = <IdentificationDto>{};
    result.id = '';
    result.refIds = [];
    result.refTypes = [];
    result.issuer='';
    result.value='';
    result.name=this.getEmptyLanguageSpecificStringsDto();
    return result;
  }

  getEmptyLocationDto(): LocationDto {
    var result = <LocationDto>{}
    result.id = '';
    result.countryCode = 'DE';
    result.street = '';
    result.houseNumber = '';
    result.city = '';
    result.additionalInformation = this.getEmptyRichContentDto();
    return result;
  }
  
  getEmptyContactDto(): ContactDto {
    var result = <ContactDto>{};
    result.id = '';
    result.refIds = [];
    result.refTypes = [];
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.location = this.getEmptyLocationDto();
    return result;
  }

  getEmptyCalibrationLaboratoryDto(): CalibrationLaboratoryDto {
    var result = <CalibrationLaboratoryDto>{};
    result.contact = this.getEmptyContactDto();
    return result;
  }
  
  getEmptyEquipmentDto(): EquipmentDto {
    var result = <EquipmentDto>{};
    result.id = '';
    result.refIds = [];
    result.refTypes = [];
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.manufacturer = this.getEmptyContactDto();
    return result;
  }

  getEmptyStatementDto(): StatementDto {
    var result = <StatementDto>{};
    result.id = '';
    result.refIds = [];
    result.refTypes = [];
    result.countryCodes = new Array<string>
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.description = this.getEmptyRichContentDto();
    result.declaration = this.getEmptyRichContentDto();
    result.norms = new Array<string>;
    result.references = new Array<string>;
    result.data = new Array<DataDto>();
    result.location = this.getEmptyLocationDto();
    result.responsibleAuthority = this.getEmptyContactDto();
    return result;
  }

  getEmptyResultDto(): ResultDto {
    var result = <ResultDto>{};
    result.id = '';
    result.refIds = [];
    result.refTypes = [];
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.data = new Array<DataDto>;
    result.data.push(this.getEmptyDataDto());
    return result;
  }

  getEmptySoftwareDto(): SoftwareDto {
    var result = <SoftwareDto>{};
    result.id = '';
    result.refIds = [];
    result.refTypes = [];
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.version = '';
    return result;
  }

  getEmptyMethodDto(): MethodDto {
    var result = <MethodDto>{};
    result.id = '';
    result.refIds = [];
    result.refTypes = [];
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.description = this.getEmptyRichContentDto();
    result.norms = new Array<string>;
    return result;
  }

  getEmptyListDto(): ListDto {
    var result = <ListDto>{};
    result.id = '';
    result.refIds = [];
    result.refTypes = [];
    result.description = this.getEmptyRichContentDto();
    result.quantities = new Array<QuantityDto>;
    result.quantities.push(this.getEmptyQuantityDto());
    result.usedMethods = new Array<MethodDto>;
    result.quantities.push(this.getEmptyMethodDto());
    result.list = new Array<ListDto>;
    return result;
  }

  getEmptyItemDto(): ItemDto {
    var result = <ItemDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.identifications = new Array<IdentificationDto>();
    result.identifications.push(this.getEmptyIdentifictionDto());
    result.installedSoftwares = new Array<SoftwareDto>();
    result.manufacturer = this.getEmptyContactDto();
    result.description = this.getEmptyRichContentDto();
    return result;
  }

  getEmptyMeasurementResultDto(): MeasurementResultDto {
    var result = <MeasurementResultDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.usedMethods = new Array<MethodDto>;
    result.usedSoftware = new Array<SoftwareDto>;
    result.equipment = new Array<EquipmentDto>;
    result.equipment.push(this.getEmptyEquipmentDto());
    result.influenceConditions = new Array<ConditionDto>;
    result.results = new Array<ResultDto>;
    result.results.push(this.getEmptyResultDto());
    result.statements = new Array<StatementDto>;
    result.statements.push(this.getEmptyStatementDto());
    return result;
  }
}
