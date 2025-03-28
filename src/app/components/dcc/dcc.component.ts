import { AfterContentChecked, ViewChild, ChangeDetectorRef, Component, OnInit, SecurityContext } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

import { AdministrativeDataDto } from '../../generated/dcc/model/administrativeDataDto';
import { CalibrationCertificateDto } from '../../generated/dcc/model/calibrationCertificateDto';
import { CalibrationLaboratoryDto } from '../../generated/dcc/model/calibrationLaboratoryDto';
import { ConditionDto } from '../../generated/dcc/model/conditionDto';
import { ContactDto } from '../../generated/dcc/model/contactDto';
import { DataDto } from '../../generated/dcc/model/dataDto';
import { EquipmentDto } from '../../generated/dcc/model/equipmentDto';
import { IdentificationDto } from '../../generated/dcc/model/identificationDto';
import { ItemDto } from '../../generated/dcc/model/itemDto';
import { MeasurementResultDto } from '../../generated/dcc/model/measurementResultDto';
import { MethodDto } from '../../generated/dcc/model/methodDto';
import { ResultDto } from '../../generated/dcc/model/resultDto';
import { SoftwareDto } from '../../generated/dcc/model/softwareDto';
import { StatementDto } from '../../generated/dcc/model/statementDto';
import { FormulaDto } from 'src/app/generated/dcc/model/formulaDto';
import { ByteDataDto } from 'src/app/generated/dcc/model/byteDataDto';

import { DccService } from 'src/app/services/dcc/dcc.service';
import { NGXLogger } from "ngx-logger";
import { ErrorService } from 'src/app/services/common/error/error.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DccMeasurementMetadataComponent } from './dcc-measurement-metadata/dcc-measurement-metadata.component';
import { InitializationService } from 'src/app/services/dcc/initialization.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { LocationDto } from 'src/app/generated/dcc/model/locationDto';
import { RichContentDto } from 'src/app/generated/dcc/model/richContentDto';

@Component({
  selector: 'app-dcc',
  templateUrl: './dcc.component.html',
  styleUrls: ['./dcc.component.scss']
})
export class DccComponent implements OnInit, AfterContentChecked {
  dcc: CalibrationCertificateDto;
  xml!: string;
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
  humanReadableHtml = "";
  selectedPerformanceLoc: string = '';
  performanceLocation = ["laboratory", "customer", "laboratory branch", "customer branch","other"];
  currentStepIndex = 0;
  totalSteps = 4;
  isLastStep =false
  chosenFileData: ByteDataDto | null = null;
  @ViewChild(DccMeasurementMetadataComponent) metadataComponent!: DccMeasurementMetadataComponent;
  selectedFile: any;

  constructor(
    public dccService: DccService,
    public dialog: MatDialog,
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

  public toggleCard(title:string) {
    if(this.isExpanded[title]===undefined){
      this.isExpanded[title]=true;
    }
    this.isExpanded[title]=!this.isExpanded[title];
  }

  public addCalibrationCard (title:string) {
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
    const statementToUpdate = isAddressAdded ? this.dcc.administrativeData!.statements![emptyStatementIndex!] : this.initializationService.getEmptyStatementDto();
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

  // initialiseEmptyFields(dcc: CalibrationCertificateDto): CalibrationCertificateDto {
  //   if (!dcc.administrativeData) dcc.administrativeData = <AdministrativeDataDto>{};
  //   if (!dcc.administrativeData.dccSoftware) dcc.administrativeData.dccSoftware = new Array<SoftwareDto>;
  //   if (dcc.administrativeData.dccSoftware.length == 0) dcc.administrativeData.dccSoftware.push(this.initializationService.getEmptySoftwareDto());
  //   if (!dcc.administrativeData.customer) dcc.administrativeData.customer = this.initializationService.getEmptyContactDto();
  //   if (!dcc.administrativeData.customer.location?.additionalInformation?.name){
  //     dcc.administrativeData.customer.location!.additionalInformation!.name=this.initializationService.getEmptyLanguageSpecificStringsDto();
  //   }
  //   if (!dcc.administrativeData.customer.location?.additionalInformation?.textContent){
  //     dcc.administrativeData.customer.location!.additionalInformation!.textContent=this.initializationService.getEmptyLanguageSpecificStringsDto();
  //   }
  //   if (!dcc.administrativeData.calibrationLaboratory) dcc.administrativeData.calibrationLaboratory = this.getEmptyCalibrationLaboratoryDto();
  //   if (!dcc.administrativeData.calibrationLaboratory.contact?.location?.additionalInformation?.name){
  //     dcc.administrativeData.calibrationLaboratory.contact!.location!.additionalInformation!.name=this.initializationService.getEmptyLanguageSpecificStringsDto();
  //   }
  //   if (!dcc.administrativeData.calibrationLaboratory.contact?.location?.additionalInformation?.textContent){
  //     dcc.administrativeData.calibrationLaboratory.contact!.location!.additionalInformation!.textContent=this.initializationService.getEmptyLanguageSpecificStringsDto();
  //   }
  //   if (!dcc.administrativeData.responsiblePersons) dcc.administrativeData.responsiblePersons = new Array<ContactDto>();
  //   if (dcc.administrativeData.responsiblePersons.length == 0) dcc.administrativeData.responsiblePersons.push(this.getEmptyRespPersonDto());
  //   if (!dcc.administrativeData.items) dcc.administrativeData.items = new Array<ItemDto>;
  //   if (dcc.administrativeData.items.length == 0) dcc.administrativeData.items.push(this.getEmptyItemDto());
  //   dcc.administrativeData.items.forEach((entry: any) => {
  //     if (entry.installedSoftwares == null) {
  //       entry.installedSoftwares = new Array<SoftwareDto>;
  //     }
  //     if (entry.installedSoftwares.length == 0) entry.installedSoftwares.push(this.initializationService.getEmptySoftwareDto());

  //     if (entry.manufacturer == null) {
  //       entry.manufacturer = this.initializationService.getEmptyContactDto();
  //     }
  //     if (entry.description == null) {
  //       entry.description = this.initializationService.getEmptyRichContentDto();
  //     }
  //   });
  //   if (!dcc.administrativeData.statements) dcc.administrativeData.statements = new Array<StatementDto>();
  //   if (dcc.administrativeData?.statements?.length == 0) dcc.administrativeData.statements.push(this.initializationService.getEmptyStatementDto());
  //   dcc.administrativeData.statements.forEach((statement: any) => {
  //     this.initializeStatement(statement);
  //   });
  //   if (!dcc.measurementResults) dcc.measurementResults = new Array<MeasurementResultDto>();
  //   if (dcc.measurementResults.length == 0) dcc.measurementResults.push(this.getEmptyMeasurementResultDto());
  //   dcc.measurementResults.forEach((entry: any) => {
  //     if (entry.usedSoftware == null) {
  //       entry.usedSoftware = new Array<SoftwareDto>();
  //     }
  //     if (entry.usedSoftware.length == 0) entry.usedSoftware.push(this.initializationService.getEmptySoftwareDto());

  //     if (entry.equipment == null) {
  //       entry.equipment = new Array<EquipmentDto>();
  //     }
  //     if (entry.equipment.length == 0) entry.equipment.push(this.initializationService.getEmptyEquipmentDto());
  //     entry.equipment.forEach((subentry: any) => {
  //       if (subentry.manufacturer == null) {
  //         subentry.manufacturer = this.initializationService.getEmptyContactDto();
  //       }
  //     });
  //     if (entry.influenceConditions == null) {
  //       entry.influenceConditions = new Array<ConditionDto>();
  //     }
  //     if (entry.influenceConditions.length == 0) entry.influenceConditions.push(this.initializationService.getEmptyConditionDto());

  //     if (entry.statements == null) {
  //       entry.statements = new Array<StatementDto>();
  //     }
  //     if (entry.statements.length == 0) entry.statements.push(this.initializationService.getEmptyStatementDto());
  //     entry.statements.forEach((statement: any) => {
  //       this.initializeStatement(statement);
  //     });
  //     if (entry.usedMethods == null) {
  //       entry.usedMethods = new Array<MethodDto>();
  //     }
  //     if (entry.usedMethods.length == 0) {
  //       entry.usedMethods.push(this.initializationService.getEmptyMethodDto());
  //     } else {
  //       entry.usedMethods.forEach((subentry: any) => {
  //         if (subentry.norms == null) {
  //           subentry.norms = new Array<string>
  //         }
  //         if (subentry.norms.length == 0) subentry.norms.push("");
  //       });
  //     }
  //     if (entry.results == null) {
  //       entry.results = new Array<ResultDto>();
  //     }
  //     if (entry.results.length == 0) {
  //       entry.results.push(this.initializationService.getEmptyResultDto());
  //     }
  //     entry.results.forEach((subentry: any) => {
  //       if (subentry.data == null) {
  //         subentry.data = new Array<DataDto>();
  //       }
  //     });
  //   });
  //   return dcc;
  // }
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
    if (!dcc.administrativeData.calibrationLaboratory) dcc.administrativeData.calibrationLaboratory = this.initializationService.getEmptyCalibrationLaboratoryDto();

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
        entry.manufacturer = <ContactDto>{};
        entry.manufacturer.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
      }
      if (entry.manufacturer.location == null) {
        entry.manufacturer.location = <LocationDto>{};
        entry.manufacturer.location.additionalInformation = this.initializationService.getEmptyRichContentDto();
        entry.manufacturer.location.additionalInformation.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
        entry.manufacturer.location.additionalInformation.textContent = this.initializationService.getEmptyLanguageSpecificStringsDto();
      }
      if (entry.description == null) {
        entry.description = <RichContentDto>{};
        entry.description.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
        entry.description.textContent = this.initializationService.getEmptyLanguageSpecificStringsDto();
      }
    });
    if (!dcc.administrativeData.statements) dcc.administrativeData.statements = new Array<StatementDto>();
    if (dcc.administrativeData?.statements?.length == 0) dcc.administrativeData.statements.push(this.initializationService.getEmptyStatementDto());
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
      if (entry.equipment.length == 0) entry.equipment.push(this.initializationService.getEmptyEquipmentDto());
      entry.equipment.forEach((subentry: any) => {
        if (subentry.manufacturer == null) {
          subentry.manufacturer = this.initializationService.getEmptyContactDto();
        }
      });
      if (entry.influenceConditions == null) {
        entry.influenceConditions = new Array<ConditionDto>();
      }
      if (entry.influenceConditions.length == 0) {
        entry.influenceConditions.push(this.initializationService.getEmptyConditionDto());
      }
      if (entry.statements == null) {
        entry.statements = new Array<StatementDto>();
      }
      if (entry.statements.length == 0) entry.statements.push(this.initializationService.getEmptyStatementDto());
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
        entry.results.push(this.initializationService.getEmptyResultDto());
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
    result.identifications.push(this.initializationService.getEmptyIdentifictionDto());
    result.installedSoftwares = new Array<SoftwareDto>();
    result.manufacturer = this.initializationService.getEmptyContactDto();
    result.description = this.initializationService.getEmptyRichContentDto();
    return result;
  }

  getEmptyRespPersonDto(): ContactDto {
    var result = <ContactDto>{};
    result.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
    result.location = this.initializationService.getEmptyLocationDto();
    return result;
  }

  getEmptyCalibrationLaboratoryDto(): CalibrationLaboratoryDto {
    var result = <CalibrationLaboratoryDto>{};
    result.contact=this.initializationService.getEmptyContactDto();
    return result;
  }

  getEmptyMeasurementResultDto(): MeasurementResultDto {
    var result = <MeasurementResultDto>{};
    result.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
    result.usedMethods = new Array<MethodDto>;
    result.usedSoftware = new Array<SoftwareDto>;
    result.equipment = new Array<EquipmentDto>;
    result.equipment.push(this.initializationService.getEmptyEquipmentDto());
    result.influenceConditions = new Array<ConditionDto>;
    result.results = new Array<ResultDto>;
    result.results.push(this.initializationService.getEmptyResultDto());
    result.statements = new Array<StatementDto>;
    result.statements.push(this.initializationService.getEmptyStatementDto());
    return result;
  }

  onFileSelected(fileData: ByteDataDto) {
    this.chosenFileData = fileData
  }
  
  attachFileToByteDataContent() {
    if (!this.chosenFileData) {
      return;
    }
    if (!this.dcc || !this.dcc.administrativeData) {
      return;
    }  
    const contact = this.dcc.administrativeData.calibrationLaboratory?.contact;
    if (!contact) {
      return;
    }
    if (!contact.location) {
      contact.location = {};
    }
    if (!contact.location.additionalInformation) {
      contact.location.additionalInformation = {};
    }
    if (!contact.location.additionalInformation.byteDataContent) {
      contact.location.additionalInformation.byteDataContent = {};
    }
    contact.location.additionalInformation.byteDataContent = this.chosenFileData;  
  }
  
  submit() {
    this.dccService.jsonToXml(this.dcc).subscribe(
      {
        next: (response: string) => {
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

  onTabChange(event: MatTabChangeEvent): void {
    this.loadHumanReadable();
  }

  onStepChange(event: StepperSelectionEvent): void {
    if (event.selectedIndex === 4) {
      this.onTabChange({ index: 0, tab: { textLabel: 'Human Readable' } } as MatTabChangeEvent);
    }
    this.currentStepIndex = event.selectedIndex;
    this.updateStepState();
  }

  loadHumanReadable() {
    this.dccService.jsonToHuman(this.dcc).subscribe(
      {
        next: (response: string) => {
          this.humanReadableHtml = response;
        },
        error: (error: any) => {
          this.errorService.logError(error);
        },
        complete: () => { }
      }
    );
  }

  private updateStepState(): void {
    this.isLastStep = this.currentStepIndex === this.totalSteps - 1;
  }
}
