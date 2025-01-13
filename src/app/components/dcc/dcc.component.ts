import { HttpClient } from '@angular/common/http';
import { AfterContentChecked, ViewChild, ChangeDetectorRef, Component, OnInit, SecurityContext } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AdministrativeDataDto } from '../../generated/dcc/model/administrativeDataDto';
import { LanguageSpecificStringsDto } from '../../generated/dcc/model/languageSpecificStringsDto';
import { CalibrationCertificateDto } from '../../generated/dcc/model/calibrationCertificateDto';
import { CalibrationLaboratoryDto } from '../../generated/dcc/model/calibrationLaboratoryDto';
import { ConditionDto } from '../../generated/dcc/model/conditionDto';
import { ContactDto } from '../../generated/dcc/model/contactDto';
import { DataDto } from '../../generated/dcc/model/dataDto';
import { DimensionDto } from '../../generated/dcc/model/dimensionDto';
import { EquipmentDto } from '../../generated/dcc/model/equipmentDto';
import { IdentificationDto } from '../../generated/dcc/model/identificationDto';
import { ItemDto } from '../../generated/dcc/model/itemDto';
import { LocationDto } from '../../generated/dcc/model/locationDto';
import { MeasurementResultDto } from '../../generated/dcc/model/measurementResultDto';
import { MethodDto } from '../../generated/dcc/model/methodDto';
import { QuantityDto } from '../../generated/dcc/model/quantityDto';
import { ResultDto } from '../../generated/dcc/model/resultDto';
import { RichContentDto } from '../../generated/dcc/model/richContentDto';
import { SoftwareDto } from '../../generated/dcc/model/softwareDto';
import { StatementDto } from '../../generated/dcc/model/statementDto';
import { FormulaDto } from 'src/app/generated/dcc/model/formulaDto';

import { DccService } from 'src/app/services/dcc/dcc.service';
import { GenericFileUploadComponent } from '../common/generic-file-upload/generic-file-upload.component';
import { NGXLogger } from "ngx-logger";
import { ErrorService } from 'src/app/services/common/error/error.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LangTextPair } from 'src/app/generated/dcc/model/langTextPair';
import { ByteDataDto } from 'src/app/generated/dcc/model/byteDataDto';
import { ListDto } from 'src/app/generated/dcc/model/listDto';
import { DccMeasurementMetadataComponent } from './dcc-measurement-metadata/dcc-measurement-metadata.component';

@Component({
  selector: 'app-dcc',
  templateUrl: './dcc.component.html',
  styleUrls: ['./dcc.component.scss']
})
export class DccComponent implements OnInit,AfterContentChecked {
  dcc: CalibrationCertificateDto;
  xml!: string;
  exampleFileUrl!: string;
  validPerformanceLocations = ["LABORATORY", "CUSTOMER", "LABORATORY_BRANCH", "CUSTOMER_BRANCH", "OTHER"];
  validConformityStatementStatusTypes = ["pass", "fail", "conditionalPass", "conditionalFail", "noPass", "noFail"];
  header_meta_data = "Meta-Data";
  header_statement = "Statement";
  statement!: StatementDto;
  addressForm!: FormGroup;
  showEmptyStatement = false;
  cardTitles:string[]=['DCC-Software','Basis-Daten','Kunde','Verantwortliche-Personen','Kalibrierlabor',
    'Kalibriergut1','Messergebnis1','Verwendete-Methoden','Verwendete-Messinstrumente','Einflussfaktoren','Ergebnisse','Meta-Daten','Verwendete-Software']
  isExpanded:{[title:string]:boolean}={'DCC-Software*': true};

  @ViewChild(DccMeasurementMetadataComponent) metadataComponent!: DccMeasurementMetadataComponent;

  constructor(
    public dccService: DccService,
    public dialog: MatDialog,
    private http: HttpClient,
    private errorService: ErrorService,
    private sanitizer: DomSanitizer,
    public logger: NGXLogger,
    private changeDetect: ChangeDetectorRef,
    private formBuilder: FormBuilder) {

    this.cardTitles.forEach(title=>{
      this.isExpanded[title]=true;
      })

    this.dcc = this.initialiseEmptyFields(<CalibrationCertificateDto>{});
    this.buildForm();
  }

  ngOnInit(): void {
  }
  ngAfterContentChecked(): void {
    this.changeDetect.detectChanges();
  }
  onCheckboxChange() {
    this.changeDetect.detectChanges();
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }

  public buildForm() {
    this.addressForm = this.formBuilder.group({
      addressType: [null]
    });
  }
  public toggleCard(title:string){
    console.log('isExpandend: ',this.isExpanded[title])
    if(this.isExpanded[title]===undefined){
      this.isExpanded[title]=true;
    }
      this.isExpanded[title]=!this.isExpanded[title];
  }

  public addCalibrationCard (title:string){
    this.cardTitles.push(title);
    this.isExpanded[title]=true;
  }

 addExpandedInMetadataComponent() {
  this.metadataComponent.addExpanded();
}

  public showStatement() {
    this.showEmptyStatement = true;
  }

  public add_cipmmra(value: any) {
    let isCipmAdded = false;
    let cipmIndex: number | null = null;

    for (let i = 0; i < this.dcc.administrativeData!.statements!.length; i++) {
      const statement = this.dcc.administrativeData!.statements![i];
      if (!statement.convention) {
        cipmIndex = i;
        isCipmAdded = true;
        break;
      }
    }

    let statementToUpdate = isCipmAdded ? this.dcc.administrativeData!.statements![cipmIndex!] : this.getEmptyStatementMetaDataDto();
    statementToUpdate.convention = "CIPM-MRA";
    statementToUpdate.declaration!.textContent = this.getEmptyLanguageSpecificStringsDto();
      console.log("statements-push",this.dcc.administrativeData?.statements);
      this.addExpandedInMetadataComponent();
      this.dcc.administrativeData!.statements!.push(statementToUpdate);
  }

  public add_address(value: string) {
    console.log('value Adress: ',value)
    let isAddressAdded = false;
    let emptyStatementIndex: number | null = null;
    for (let i = 0; i < this.dcc.administrativeData!.statements!.length; i++) {
      const statement = this.dcc.administrativeData!.statements![i];
      if (!statement.location?.countryCode && !statement.location?.stateCode && !statement.location?.city
        && !statement.location?.postalCode && !statement.location?.street && !statement.location?.houseNumber
        && !statement.location?.poBox
      ) {
        emptyStatementIndex = i;
        isAddressAdded = true;
        break;
      }
    }
    const statementToUpdate = isAddressAdded ? this.dcc.administrativeData!.statements![emptyStatementIndex!] : this.getEmptyStatementMetaDataDto();
    statementToUpdate.location!.additionalInformation = this.getEmptyRichContentDto();
    statementToUpdate.location!.additionalInformation!.textContent = this.getEmptyLanguageSpecificStringsDto();
    statementToUpdate.location!.additionalInformation!.textContent.content![0] = ({ lang: "de", text: "{Abteilung n}" });
    statementToUpdate.location!.additionalInformation!.textContent.content!.push({ lang: "de", text: "{Fachbereich n.m}" });
    statementToUpdate.location!.additionalInformation!.textContent.content!.push({ lang: "de", text: "{Arbeitsgruppe n.mo}" });
    if (isAddressAdded) {
      this.dcc.administrativeData!.statements![emptyStatementIndex!] = statementToUpdate;
    } else {
      this.addExpandedInMetadataComponent();
      this.dcc.administrativeData!.statements!.push(statementToUpdate);
    }
  }

  /* used to initialize all required fields for
   *   - a new entry or
   *   - after loading a template
   * ... should initialize any required but missing fields
   * NOTE: really important to fulfill defaults for retrieving a valid XML in the end
   */
  initialiseEmptyFields(dcc: CalibrationCertificateDto): CalibrationCertificateDto {
    if (!dcc.administrativeData) dcc.administrativeData = <AdministrativeDataDto>{};
    if (!dcc.administrativeData.dccSoftware) dcc.administrativeData.dccSoftware = new Array<SoftwareDto>;
    if (dcc.administrativeData.dccSoftware.length == 0) dcc.administrativeData.dccSoftware.push(this.getEmptySoftwareDto());
    if (!dcc.administrativeData.customer) dcc.administrativeData.customer = this.getEmptyContactDto();
    if (!dcc.administrativeData.calibrationLaboratory) dcc.administrativeData.calibrationLaboratory = this.getEmptyCalibrationLaboratoryDto();
    if (!dcc.administrativeData.responsiblePersons) dcc.administrativeData.responsiblePersons = new Array<ContactDto>();
    if (dcc.administrativeData.responsiblePersons.length == 0) dcc.administrativeData.responsiblePersons.push(this.getEmptyRespPersonDto());
    if (!dcc.administrativeData.items) dcc.administrativeData.items = new Array<ItemDto>;
    if (dcc.administrativeData.items.length == 0) dcc.administrativeData.items.push(this.getEmptyItemDto());
    dcc.administrativeData.items.forEach((entry: any) => {
      console.log('Item: ',entry)
      if (entry.installedSoftwares == null) {
        entry.installedSoftwares = new Array<SoftwareDto>;
      }
      if (entry.installedSoftwares.length == 0) entry.installedSoftwares.push(this.getEmptySoftwareDto());

      if (entry.manufacturer == null) {
        entry.manufacturer = <ContactDto>{};
        entry.manufacturer.name = this.getEmptyLanguageSpecificStringsDto();
      }
      if (entry.manufacturer.location == null) {
        entry.manufacturer.location = <LocationDto>{};
      }
      if (entry.description == null) {
        entry.description = <RichContentDto>{};
        entry.description.name = this.getEmptyLanguageSpecificStringsDto();
      }
    });
    if (!dcc.administrativeData.statements) dcc.administrativeData.statements = new Array<StatementDto>();
    if (dcc.administrativeData?.statements?.length == 0) dcc.administrativeData.statements.push(this.getEmptyStatementMetaDataDto());
    dcc.administrativeData.statements.forEach((statement: any) => {
      this.initializeStatement(statement);
    });
    if (!dcc.measurementResults) dcc.measurementResults = new Array<MeasurementResultDto>();
    if (dcc.measurementResults.length == 0) dcc.measurementResults.push(this.getEmptyMeasurementResultDto());
    dcc.measurementResults.forEach((entry: any) => {
      if (entry.usedSoftware == null) {
        entry.usedSoftware = new Array<SoftwareDto>();
      }
      if (entry.usedSoftware.length == 0) entry.usedSoftware.push(this.getEmptySoftwareDto());

      if (entry.equipment == null) {
        entry.equipment = new Array<EquipmentDto>();
      }
      if (entry.equipment.length == 0) entry.equipment.push(this.getEmptyEquipmentDto());
      entry.equipment.forEach((subentry: any) => {
        if (subentry.manufacturer == null) {
          subentry.manufacturer = this.getEmptyContactDto();
        }
      });
      if (entry.influenceConditions == null) {
        entry.influenceConditions = new Array<ConditionDto>();
      }
      if (entry.influenceConditions.length == 0) entry.influenceConditions.push(this.getEmptyConditionDto());

      if (entry.statements == null) {
        entry.statements = new Array<StatementDto>();
      }
      if (entry.statements.length == 0) entry.statements.push(this.getEmptyStatementMetaDataDto());
      entry.statements.forEach((statement: any) => {
        this.initializeStatement(statement);
      });
      if (entry.usedMethods == null) {
        entry.usedMethods = new Array<MethodDto>();
      }
      if (entry.usedMethods.length == 0) {
        entry.usedMethods.push(this.getEmptyMethodDto());
      } else {
        entry.usedMethods.forEach((subentry: any) => {
          if (subentry.norms == null) {
            subentry.norms = new Array<string>
          }
          if (subentry.norms.length == 0) subentry.norms.push("");
        });
      }
      if (entry.results == null) {
        entry.results = new Array<ResultDto>();
      }
      if (entry.results.length == 0) {
        entry.results.push(this.getEmptyResultDto());
      }
      entry.results.forEach((subentry: any) => {
        if (subentry.data == null) {
          subentry.data = new Array<DataDto>();
        }
      });
    });
    return dcc;
  }

  initializeStatement(statement: StatementDto) {
    if (statement.data == null || undefined) {
      statement.data = new Array<DataDto>();
    }
    if (statement.countryCodes == null || undefined) {
      statement.countryCodes = new Array<string>();
    }
    if (statement.name == null || undefined) {
      statement.name = this.getEmptyLanguageSpecificStringsDto();
    }
    if (statement.norms == null || undefined) {
      statement.norms = new Array<string>();
    }
    if (statement.references == null || undefined) {
      statement.references = new Array<string>();
    }
    if (statement.description == null || undefined) {
      statement.description = this.getEmptyRichContentDto();
    }
    if (statement.description.name == null || undefined) {
      statement.description.name = this.getEmptyLanguageSpecificStringsDto();
    }
    if (statement.description.textContent == null || undefined) {
      statement.description.textContent = this.getEmptyLanguageSpecificStringsDto();
    }
    if (statement.declaration == null || undefined) {
      statement.declaration = this.getEmptyRichContentDto();
    }
    if (statement.declaration.name == null || undefined) {
      statement.declaration.name = this.getEmptyLanguageSpecificStringsDto();
    }
    if (statement.declaration.textContent == null || undefined) {
      statement.declaration.textContent = this.getEmptyLanguageSpecificStringsDto();
    }
    if (statement.location == null || undefined) {
      statement.location = this.getEmptyLocationDto();
    }
    if (statement.location.additionalInformation == null || undefined) {
      statement.location.additionalInformation = this.getEmptyRichContentDto();
    }
    if (statement.location.additionalInformation.name == null || undefined) {
      statement.location.additionalInformation.name = this.getEmptyLanguageSpecificStringsDto();
    }
    if (statement.location.additionalInformation.textContent == null || undefined) {
      statement.location.additionalInformation.textContent = this.getEmptyLanguageSpecificStringsDto();
    }
    if (statement.responsibleAuthority == null || undefined) {
      statement.responsibleAuthority = this.getEmptyContactDto();
    }
    if (statement.responsibleAuthority.location == null || undefined) {
      statement.responsibleAuthority.location = this.getEmptyLocationDto();
    }
    if (statement.responsibleAuthority.location?.additionalInformation == null || undefined) {
      statement.responsibleAuthority.location.additionalInformation = this.getEmptyRichContentDto();
    }

  }

  getEmptyItemDto(): ItemDto {
    var result = <ItemDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.identifications = new Array<IdentificationDto>();
    result.identifications.push(this.getEmptyIdentificationDto());
    result.installedSoftwares = new Array<SoftwareDto>();
    result.manufacturer = this.getEmptyContactDto();
    result.description = this.getEmptyRichContentDto();
    return result;
  }

  getEmptyIdentificationDto():IdentificationDto{
    var result =<IdentificationDto>{}
    result.issuer="";
    result.value="";
    result.name=this.getEmptyLanguageSpecificStringsDto();
    return result;
  }

  getEmptyLanguageSpecificStringsDto(): LanguageSpecificStringsDto {
    var result = <LanguageSpecificStringsDto>{};
    result.content = new Array<LangTextPair>;
    result.content.push(<LangTextPair>{})
    return result;
  }

  getEmptyRespPersonDto(): ContactDto {
    var result = <ContactDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.location = this.getEmptyLocationDto();
    return result;
  }

  getEmptyCalibrationLaboratoryDto():CalibrationLaboratoryDto{
    var result = <CalibrationLaboratoryDto>{};
    result.contact=this.getEmptyContactDto();
    return result;

  }
  getEmptyStatementMetaDataDto(): StatementDto {
    var result = <StatementDto>{};
    result.countryCodes = new Array<string>;
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

  getEmptyLocationDto(): LocationDto {
    var result = <LocationDto>{}
    result.additionalInformation = this.getEmptyRichContentDto();
    return result;
  }

  getEmptyRichContentDto(): RichContentDto {
    var result = <RichContentDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.textContent = this.getEmptyLanguageSpecificStringsDto();
    result.byteDataContent = <ByteDataDto>{};
    result.formulaContent = <FormulaDto>{};
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
    result.statements.push(this.getEmptyStatementMetaDataDto());
    return result;
  }

  getEmptySoftwareDto(): SoftwareDto {
    var result = <SoftwareDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    return result;
  }

  getEmptyResultDto(): ResultDto {
    var result = <ResultDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.data = new Array<DataDto>();
    result.data.push(<DataDto>{});
    result.data[0].quantity = this.getEmptyQuantityDto();
    return result;
  }

  getEmptyConditionDto(): ConditionDto {
    var result = <ConditionDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.data = new Array<DataDto>();
    return result;
  }

  getEmptyQuantityDto(): QuantityDto {
    var result = <QuantityDto>{};
    result.dimension = <DimensionDto>{};
    result.quantityTypeName = "REAL";
    return result;
  }

  getEmptyDataDto(): DataDto {
    var result = <DataDto>{};
    result.list = this.getEmptyListDto();
    return result;
  }

  getEmptyListDto(): ListDto {
    var result = <ListDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.quantities = new Array<QuantityDto>();
    result.quantities.push(this.getEmptyQuantityDto());
    return result;
  }

  getEmptyMethodDto(): MethodDto {
    var result = <MethodDto>{};
    result.norms = new Array<string>();
    result.norms.push("");
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.description = <RichContentDto>{};
    return result;
  }

  getEmptyEquipmentDto(): EquipmentDto {
    var result = <EquipmentDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.manufacturer=this.getEmptyContactDto();
    return result;
  }
  getEmptyContactDto(): ContactDto {
    var result = <ContactDto>{};
    result.name = this.getEmptyLanguageSpecificStringsDto();
    result.location = this.getEmptyLocationDto();
    return result;
  }

  submit() {
    this.logger.trace("Sending json to dcc.jsonToXml: " + JSON.stringify(this.dcc, null, 2));
    this.dccService.jsonToXml(this.dcc).subscribe(
      {
        next: (response: string) => {
          this.logger.trace("Got XML from dcc.jsonToXml: " + response);
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(new Blob([response], { type: "application/xml" }));
          a.href = objectUrl;
          a.download = this.dcc.administrativeData!.uniqueIdentifier + ".xml";
          a.click();
          URL.revokeObjectURL(objectUrl);
        },
        error: (error: any) => {
          this.errorService.logError(error);
        },
        complete: () => { }
      }
    );
  }

  dummydata() {
    this.showEmptyStatement = true;
    this.http.get(this.exampleFileUrl, { responseType: 'text' }).subscribe(
      {
        next: (xml: string) => {
          this.dccService.xmlToJson(xml.toString()).subscribe(
            {
              next: (json: CalibrationCertificateDto) => {
                this.logger.trace("Got json from dcc.xmlToJson: " + JSON.stringify(json, null, 2));
                this.dcc = this.initialiseEmptyFields(json);
              },
              error: (error: any) => {
                this.errorService.logError(error);
              },
              complete: () => { }
            }
          );
        },
        error: (error: any) => {
          this.errorService.logError(error);
        },
        complete: () => { }
      });
  }
  preview() {
    // TODO: rewrite for observer pattern
    this.dccService.jsonToHtml(this.dcc).subscribe(response => {
      this.logger.trace("Got html preview from dcc.jsonToHtml: " + response);
    },
      error => {
        this.errorService.logError(error);
      });
  }

  openFileUploadDialog(): void {
    const dialogRef = this.dialog.open(GenericFileUploadComponent, {
      width: '500px',
      data: {
        text: "lokalen Kalibrierschein (.xml) auswählen, der als Vorlage benutzt werden soll",
        uploadFunction: this.dccService.xmlToJson
      }
    });
  }

  formula: FormulaDto | any = {
    // Hier setzen Sie die Werte entsprechend Ihrer Anforderungen
    id: '1',
    content: ['<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>x</mi><mo>+</mo><mi>y</mi><mo>=</mo><mi>z</mi></mrow></math>'],
    type: FormulaDto.TypeEnum.Mathml
  };

  renderMathML(mathML: string) {
    return this.sanitizer.sanitize(SecurityContext.HTML, mathML);
  }
}


