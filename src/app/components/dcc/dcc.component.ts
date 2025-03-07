import { HttpClient } from '@angular/common/http';
import { AfterContentChecked, ViewChild, ChangeDetectorRef, Component, OnInit, SecurityContext } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

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
import { LangTextPair } from 'src/app/generated/dcc/model/langTextPair';
import { ByteDataDto } from 'src/app/generated/dcc/model/byteDataDto';
import { ListDto } from 'src/app/generated/dcc/model/listDto';

import { DccService } from 'src/app/services/dcc/dcc.service';
import { GenericFileUploadComponent } from '../common/generic-file-upload/generic-file-upload.component';
import { NGXLogger } from "ngx-logger";
import { ErrorService } from 'src/app/services/common/error/error.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DccMeasurementMetadataComponent } from './dcc-measurement-metadata/dcc-measurement-metadata.component';
import { InitializationService } from 'src/app/services/dcc/initialization.service';

@Component({
  selector: 'app-dcc',
  templateUrl: './dcc.component.html',
  styleUrls: ['./dcc.component.scss']
})
export class DccComponent implements OnInit, AfterContentChecked {
  dcc: CalibrationCertificateDto;
  xml!: string;
  templateFileUrl!: string;
  uploadedFileUrl!: string;
  validPerformanceLocations = ["LABORATORY", "CUSTOMER", "LABORATORY_BRANCH", "CUSTOMER_BRANCH", "OTHER"];
  validConformityStatementStatusTypes = ["pass", "fail", "conditionalPass", "conditionalFail", "noPass", "noFail"];
  header_meta_data = "Meta-Data";
  header_statement = "Statement";
  statement!: StatementDto;
  addressForm!: FormGroup;
  showEmptyStatement = false;
  cardTitles: string[] = ['DCC-Software','Basis-Daten','Kunde','Verantwortliche-Personen','Kalibrierlabor','Identifikatoren','Installierte-Software','CIPM-MRA','Anschrift',
    'Kalibriergut1','Messergebnis1','Verwendete-Methoden','Verwendete-Messinstrumente','Einflussfaktoren','Ergebnisse','Meta-Daten','Verwendete-Software']
  isExpanded:{[title:string]:boolean}={'DCC-Software*': true};
  currentStepIndex = 0;
  totalSteps = 4;
  isLastStep =false
  @ViewChild(DccMeasurementMetadataComponent) metadataComponent!: DccMeasurementMetadataComponent;

  constructor(
    public dccService: DccService,
    public dialog: MatDialog,
    private http: HttpClient,
    private errorService: ErrorService,
    private initializationService: InitializationService,
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
    console.log('isExpanded: ',this.isExpanded[title])
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
    statementToUpdate.location!.additionalInformation = this.initializationService.getEmptyRichContentDto();
    statementToUpdate.location!.additionalInformation!.textContent = this.initializationService.getEmptyLanguageSpecificStringsDto();
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

  initialiseEmptyFields(dcc: CalibrationCertificateDto): CalibrationCertificateDto {
    if (!dcc.administrativeData) dcc.administrativeData = <AdministrativeDataDto>{};
    if (!dcc.administrativeData.dccSoftware) dcc.administrativeData.dccSoftware = new Array<SoftwareDto>;
    if (dcc.administrativeData.dccSoftware.length == 0) dcc.administrativeData.dccSoftware.push(this.initializationService.getEmptySoftwareDto());
    if (!dcc.administrativeData.customer) dcc.administrativeData.customer = this.initializationService.getEmptyContactDto();
    if (!dcc.administrativeData.customer.location?.additionalInformation?.name){
      dcc.administrativeData.customer.location!.additionalInformation!.name=this.initializationService.getEmptyLanguageSpecificStringsDto();
    }
    if (!dcc.administrativeData.customer.location?.additionalInformation?.textContent){
      dcc.administrativeData.customer.location!.additionalInformation!.textContent=this.initializationService.getEmptyLanguageSpecificStringsDto();
    }
    if (!dcc.administrativeData.calibrationLaboratory) dcc.administrativeData.calibrationLaboratory = this.getEmptyCalibrationLaboratoryDto();
    if (!dcc.administrativeData.calibrationLaboratory.contact?.location?.additionalInformation?.name){
      dcc.administrativeData.calibrationLaboratory.contact!.location!.additionalInformation!.name=this.initializationService.getEmptyLanguageSpecificStringsDto();
    }
    if (!dcc.administrativeData.calibrationLaboratory.contact?.location?.additionalInformation?.textContent){
      dcc.administrativeData.calibrationLaboratory.contact!.location!.additionalInformation!.textContent=this.initializationService.getEmptyLanguageSpecificStringsDto();
    }
    if (!dcc.administrativeData.responsiblePersons) dcc.administrativeData.responsiblePersons = new Array<ContactDto>();
    if (dcc.administrativeData.responsiblePersons.length == 0) dcc.administrativeData.responsiblePersons.push(this.getEmptyRespPersonDto());
    if (!dcc.administrativeData.items) dcc.administrativeData.items = new Array<ItemDto>;
    if (dcc.administrativeData.items.length == 0) dcc.administrativeData.items.push(this.getEmptyItemDto());
    dcc.administrativeData.items.forEach((entry: any) => {
      if (entry.installedSoftwares == null) {
        entry.installedSoftwares = new Array<SoftwareDto>;
      }
      if (entry.installedSoftwares.length == 0) entry.installedSoftwares.push(this.initializationService.getEmptySoftwareDto());

      if (entry.manufacturer == null) {
        entry.manufacturer = this.initializationService.getEmptyContactDto();
      }
      if (entry.description == null) {
        entry.description = this.initializationService.getEmptyRichContentDto();
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
      if (entry.usedSoftware.length == 0) entry.usedSoftware.push(this.initializationService.getEmptySoftwareDto());

      if (entry.equipment == null) {
        entry.equipment = new Array<EquipmentDto>();
      }
      if (entry.equipment.length == 0) entry.equipment.push(this.getEmptyEquipmentDto());
      entry.equipment.forEach((subentry: any) => {
        if (subentry.manufacturer == null) {
          subentry.manufacturer = this.initializationService.getEmptyContactDto();
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
        entry.usedMethods.push(this.initializationService.getEmptyMethodDto());
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
      statement.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
    }
    if (statement.norms == null || undefined) {
      statement.norms = new Array<string>();
    }
    if (statement.references == null || undefined) {
      statement.references = new Array<string>();
    }
    if (statement.description == null || undefined) {
      statement.description = this.initializationService.getEmptyRichContentDto();
    }
    if (statement.description.name == null || undefined) {
      statement.description.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
    }
    if (statement.description.textContent == null || undefined) {
      statement.description.textContent = this.initializationService.getEmptyLanguageSpecificStringsDto();
    }
    if (statement.declaration == null || undefined) {
      statement.declaration = this.initializationService.getEmptyRichContentDto();
    }
    if (statement.declaration.name == null || undefined) {
      statement.declaration.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
    }
    if (statement.declaration.textContent == null || undefined) {
      statement.declaration.textContent = this.initializationService.getEmptyLanguageSpecificStringsDto();
    }
    if (statement.location == null || undefined) {
      statement.location = this.initializationService.getEmptyLocationDto();
    }
    if (statement.location.additionalInformation == null || undefined) {
      statement.location.additionalInformation = this.initializationService.getEmptyRichContentDto();
    }
    if (statement.location.additionalInformation.name == null || undefined) {
      statement.location.additionalInformation.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
    }
    if (statement.location.additionalInformation.textContent == null || undefined) {
      statement.location.additionalInformation.textContent = this.initializationService.getEmptyLanguageSpecificStringsDto();
    }
    if (statement.responsibleAuthority == null || undefined) {
      statement.responsibleAuthority = this.initializationService.getEmptyContactDto();
    }
    if (statement.responsibleAuthority.location == null || undefined) {
      statement.responsibleAuthority.location = this.initializationService.getEmptyLocationDto();
    }
    if (statement.responsibleAuthority.location?.additionalInformation == null || undefined) {
      statement.responsibleAuthority.location.additionalInformation = this.initializationService.getEmptyRichContentDto();
    }
  }

  getEmptyItemDto(): ItemDto {
    var result = <ItemDto>{};
    result.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
    result.identifications = new Array<IdentificationDto>();
    result.identifications.push(this.getEmptyIdentificationDto());
    result.installedSoftwares = new Array<SoftwareDto>();
    result.manufacturer = this.initializationService.getEmptyContactDto();
    result.description = this.initializationService.getEmptyRichContentDto();
    return result;
  }

  getEmptyIdentificationDto():IdentificationDto{
    var result =<IdentificationDto>{}
    result.issuer="";
    result.value="";
    result.name=this.initializationService.getEmptyLanguageSpecificStringsDto();
    return result;
  }

  getEmptyRespPersonDto(): ContactDto {
    var result = <ContactDto>{};
    result.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
    result.location = this.initializationService.getEmptyLocationDto();
    return result;
  }

  getEmptyCalibrationLaboratoryDto():CalibrationLaboratoryDto{
    var result = <CalibrationLaboratoryDto>{};
    result.contact=this.initializationService.getEmptyContactDto();
    return result;

  }
  getEmptyStatementMetaDataDto(): StatementDto {
    var result = <StatementDto>{};
    result.countryCodes = new Array<string>;
    result.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
    result.description = this.initializationService.getEmptyRichContentDto();
    result.declaration = this.initializationService.getEmptyRichContentDto();
    result.norms = new Array<string>;
    result.references = new Array<string>;
    result.data = new Array<DataDto>();
    result.location = this.initializationService.getEmptyLocationDto();
    result.responsibleAuthority = this.initializationService.getEmptyContactDto();
    return result;
  }

  getEmptyMeasurementResultDto(): MeasurementResultDto {
    var result = <MeasurementResultDto>{};
    result.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
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

  getEmptyResultDto(): ResultDto {
    var result = <ResultDto>{};
    result.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
    result.data = new Array<DataDto>();
    result.data.push(<DataDto>{});
    result.data[0].quantity = this.initializationService.getEmptyQuantityDto();
    return result;
  }

  getEmptyConditionDto(): ConditionDto {
    var result = <ConditionDto>{};
    result.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
    result.data = new Array<DataDto>();
    return result;
  }

  getEmptyListDto(): ListDto {
    var result = <ListDto>{};
    result.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
    result.quantities = new Array<QuantityDto>();
    result.quantities.push(this.initializationService.getEmptyQuantityDto());
    return result;
  }

  getEmptyEquipmentDto(): EquipmentDto {
    var result = <EquipmentDto>{};
    result.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
    result.manufacturer=this.initializationService.getEmptyContactDto();
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

  useTemplate() {
    this.showEmptyStatement = true;
    this.http.get(this.templateFileUrl, { responseType: 'text' }).subscribe(
      {
        next: (xml: string) => {
          this.dccService.xmlToJson(xml.toString()).subscribe(
            {
              next: (json: CalibrationCertificateDto) => {
                this.dcc = this.initialiseEmptyFields(json);
              },
              error: (error: any) => {
                this.errorService.logError(error);
              },
              complete: () => {}
            }
          );
        },
        error: (error: any) => {
          this.errorService.logError(error);
        },
        complete: () => {}
      });
  }

  preview() {
    this.dccService.jsonToHtml(this.dcc).subscribe(response => {
    },
    error => {
      this.errorService.logError(error);
    });
  }

  formula: FormulaDto | any = {
    id: '1',
    content: ['<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>x</mi><mo>+</mo><mi>y</mi><mo>=</mo><mi>z</mi></mrow></math>'],
    type: FormulaDto.TypeEnum.Mathml
  };

  renderMathML(mathML: string) {
    return this.sanitizer.sanitize(SecurityContext.HTML, mathML);
  }

  previousStep(stepper: MatStepper): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      stepper.previous();
    }
  }

  nextStep(stepper: MatStepper): void {
    if (this.currentStepIndex < this.totalSteps - 1) {
      this.currentStepIndex++;
      stepper.next();
    }
  }

  onStepChange(event: StepperSelectionEvent): void {
    this.currentStepIndex = event.selectedIndex;
    this.updateStepState();
  }

  private updateStepState(): void {
    this.isLastStep = this.currentStepIndex === this.totalSteps - 1;
  }
}

