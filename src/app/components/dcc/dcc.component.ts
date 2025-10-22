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
import { AfterContentChecked, ViewChild, ChangeDetectorRef, Component, OnInit, SecurityContext } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AdministrativeDataDto } from '../../generated/dcc/model/administrativeDataDto';
import { CalibrationCertificateDto } from '../../generated/dcc/model/calibrationCertificateDto';
import { ConditionDto } from '../../generated/dcc/model/conditionDto';
import { ContactDto } from '../../generated/dcc/model/contactDto';
import { DataDto } from '../../generated/dcc/model/dataDto';
import { EquipmentDto } from '../../generated/dcc/model/equipmentDto';
import { ItemDto } from '../../generated/dcc/model/itemDto';
import { LocationDto } from '../../generated/dcc/model/locationDto';
import { MeasurementResultDto } from '../../generated/dcc/model/measurementResultDto';
import { MethodDto } from '../../generated/dcc/model/methodDto';
import { ResultDto } from '../../generated/dcc/model/resultDto';
import { RichContentDto } from '../../generated/dcc/model/richContentDto';
import { SoftwareDto } from '../../generated/dcc/model/softwareDto';
import { StatementDto } from '../../generated/dcc/model/statementDto';
import { FormulaDto } from 'src/app/generated/dcc/model/formulaDto';

import { DccService } from 'src/app/services/dcc/dcc.service';
import { NGXLogger } from 'ngx-logger';
import { ErrorService } from 'src/app/services/common/error/error.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ByteDataDto } from 'src/app/generated/dcc/model/byteDataDto';
import { DccMeasurementMetadataComponent } from './dcc-measurement-metadata/dcc-measurement-metadata.component';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { InitializationService } from 'src/app/services/dcc/initialization.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { signal } from '@angular/core';
import { ResponsiblePersonDto } from 'src/app/generated/dcc/model/responsiblePersonDto';

@Component({
  selector: 'app-dcc',
  templateUrl: './dcc.component.html',
  styleUrls: ['./dcc.component.scss'],
})
export class DccComponent implements OnInit, AfterContentChecked {
  dcc: CalibrationCertificateDto;
  xml!: string;
  templateFileUrl!: string;
  uploadedFileUrl!: string;
  validPerformanceLocations = ['LABORATORY', 'CUSTOMER', 'LABORATORY_BRANCH', 'CUSTOMER_BRANCH', 'OTHER'];
  validConformityStatementStatusTypes = ['pass', 'fail', 'conditionalPass', 'conditionalFail', 'noPass', 'noFail'];
  header_meta_data = 'Meta-Data';
  header_statement = 'Statement';
  currentStepIndex = 0;
  totalSteps = 5;
  isLastStep = false;
  statement!: StatementDto;
  chosenFileData: ByteDataDto | null = null;
  items: ItemDto | any = [];
  manufacturerAvailable = signal<{ [key: number]: boolean }>({});
  showEmptyStatement = false;

  cardTitles: string[] = [
    'DCC-Software',
    'Basis-Daten',
    'Kunde',
    'Verantwortliche-Personen',
    'Kalibrierlabor',
    'Identifikatoren',
    'Installierte-Software',
    'Kalibriergut1',
    'Messergebnis1',
    'Verwendete-Methoden',
    'Verwendete-Messinstrumente',
    'Einflussfaktoren',
    'Ergebnisse',
    'Meta-Daten',
    'Verwendete-Software',
  ];
  isExpanded: { [title: string]: boolean } = { 'DCC-Software*': true };
  humanReadableHtml = '';
  pdfUrl = '';
  selectedPerformanceLoc: string = '';
  performanceLocation = ['laboratory', 'customer', 'laboratory branch', 'customer branch', 'other'];
  @ViewChild(DccMeasurementMetadataComponent) metadataComponent!: DccMeasurementMetadataComponent;
  selectedFile: any;
  isInternal: boolean = false;

  constructor(
    public dccService: DccService,
    public dialog: MatDialog,
    private errorService: ErrorService,
    private initializationService: InitializationService,
    private sanitizer: DomSanitizer,
    public logger: NGXLogger,
    private changeDetect: ChangeDetectorRef
  ) {
    this.cardTitles.forEach((title) => {
      this.isExpanded[title] = true;
    });
    this.dcc = this.initialiseEmptyFields(<CalibrationCertificateDto>{});
  }

  ngOnInit() {
    if (!this.dcc.measurementResults) {
      this.dcc.measurementResults = [];
    }
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

  public toggleCard(title: string) {
    if (this.isExpanded[title] === undefined) {
      this.isExpanded[title] = true;
    }
    this.isExpanded[title] = !this.isExpanded[title];
  }

  public addCalibrationCard(title: string) {
    this.cardTitles.push(title);
    this.isExpanded[title] = true;
  }

  addExpandedInMetadataComponent() {
    this.metadataComponent.addExpanded();
  }

  public showStatement() {
    this.showEmptyStatement = true;
  }

  initialiseEmptyFields(dcc: CalibrationCertificateDto): CalibrationCertificateDto {
    if (!dcc.administrativeData) {
      dcc.administrativeData = <AdministrativeDataDto>{};
    }
    if (!dcc.administrativeData.dccSoftware) {
      dcc.administrativeData.dccSoftware = new Array<SoftwareDto>();
    }
    if (dcc.administrativeData.dccSoftware.length == 0) {
      dcc.administrativeData.dccSoftware.push(this.initializationService.getEmptySoftwareDto());
    }
    if (!dcc.administrativeData.customer) {
      dcc.administrativeData.customer = this.initializationService.getEmptyContactDto();
    }
    if (!dcc.administrativeData.customer.location) {
      dcc.administrativeData.customer.location = this.initializationService.getEmptyLocationDto();
    }
    if (!dcc.administrativeData.customer.location.additionalInformation) {
      dcc.administrativeData.customer.location.additionalInformation =
        this.initializationService.getEmptyRichContentDto();
    }
    if (!dcc.administrativeData.customer.location.additionalInformation.name) {
      dcc.administrativeData.customer.location.additionalInformation.name =
        this.initializationService.getEmptyLanguageSpecificStringsDto();
    }
    if (!dcc.administrativeData.customer.location.additionalInformation.textContent) {
      dcc.administrativeData.customer.location.additionalInformation.textContent =
        this.initializationService.getEmptyLanguageSpecificStringsDto();
    }
    if (!dcc.administrativeData.calibrationLaboratory) {
      dcc.administrativeData.calibrationLaboratory = this.initializationService.getEmptyCalibrationLaboratoryDto();
    }
    if (!dcc.administrativeData.calibrationLaboratory.contact) {
      dcc.administrativeData.calibrationLaboratory.contact = this.initializationService.getEmptyContactDto();
    }
    if (!dcc.administrativeData.calibrationLaboratory.contact.location) {
      dcc.administrativeData.calibrationLaboratory.contact.location = this.initializationService.getEmptyLocationDto();
    }
    if (!dcc.administrativeData.calibrationLaboratory.contact?.location?.additionalInformation) {
      dcc.administrativeData.calibrationLaboratory.contact!.location!.additionalInformation =
        this.initializationService.getEmptyRichContentDto();
    }
    if (!dcc.administrativeData.calibrationLaboratory.contact?.location?.additionalInformation?.name) {
      dcc.administrativeData.calibrationLaboratory.contact!.location!.additionalInformation!.name =
        this.initializationService.getEmptyLanguageSpecificStringsDto();
    }
    if (!dcc.administrativeData.calibrationLaboratory.contact?.location?.additionalInformation?.textContent) {
      dcc.administrativeData.calibrationLaboratory.contact!.location!.additionalInformation!.textContent =
        this.initializationService.getEmptyLanguageSpecificStringsDto();
    }
    if (!dcc.administrativeData.responsiblePersons) {
      dcc.administrativeData.responsiblePersons = new Array<ResponsiblePersonDto>();
    }
    if (dcc.administrativeData.responsiblePersons.length == 0) {
      dcc.administrativeData.responsiblePersons.push(this.initializationService.getEmptyResponsiblePersonDto());
    }
    if (!dcc.administrativeData.items) {
      dcc.administrativeData.items = new Array<ItemDto>();
    }
    if (dcc.administrativeData.items.length == 0)
      dcc.administrativeData.items.push(this.initializationService.getEmptyItemDto());
    dcc.administrativeData.items.forEach((entry: any, index: number) => {
      if (entry.installedSoftwares == null || undefined) {
        entry.installedSoftwares = new Array<SoftwareDto>();
      }
      if (entry.installedSoftwares.length == 0)
        entry.installedSoftwares.push(this.initializationService.getEmptySoftwareDto());
      if (entry.manufacturer == null || undefined) {
        entry.manufacturer = <ContactDto>{};
        entry.manufacturer.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
      }
      if (entry.manufacturer == null || undefined) {
        entry.manufacturer = <ConditionDto>{};
      }
      if (entry.manufacturer.location == null || undefined) {
        entry.manufacturer.location = <LocationDto>{};
      }
      if (entry.manufacturer.location.additionalInformation == null || undefined) {
        entry.manufacturer.location.additionalInformation = this.initializationService.getEmptyRichContentDto();
      }
      if (entry.manufacturer.location.additionalInformation.name == null || undefined) {
        entry.manufacturer.location.additionalInformation.name =
          this.initializationService.getEmptyLanguageSpecificStringsDto();
      }
      if (entry.manufacturer.location.additionalInformation.textContent == null || undefined) {
        entry.manufacturer.location.additionalInformation.textContent =
          this.initializationService.getEmptyLanguageSpecificStringsDto();
      }
      if (entry.description == null || undefined) {
        entry.description = <RichContentDto>{};
        entry.description.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
        entry.description.textContent = this.initializationService.getEmptyLanguageSpecificStringsDto();
      }
      this.manufacturerAvailable.update((state) => ({ ...state, [index]: true }));
    });
    if (!dcc.administrativeData.statements) {
      dcc.administrativeData.statements = new Array<StatementDto>();
    }
    if (dcc.administrativeData?.statements?.length == 0) {
      dcc.administrativeData.statements.push(this.initializationService.getEmptyStatementDto());
    }
    dcc.administrativeData.statements.forEach((statement: any) => {
      this.initializeStatement(statement);
    });
    if (!dcc.measurementResults) {
      dcc.measurementResults = new Array<MeasurementResultDto>();
    }
    if (dcc.measurementResults.length == 0) {
      dcc.measurementResults.push(this.initializationService.getEmptyMeasurementResultDto());
    }
    dcc.measurementResults.forEach((entry: any) => {
      if (entry.usedSoftware == null || undefined) {
        entry.usedSoftware = new Array<SoftwareDto>();
      }
      if (entry.usedSoftware.length == 0) {
        entry.usedSoftware.push(this.initializationService.getEmptySoftwareDto());
      }
      if (entry.equipment == null || undefined) {
        entry.equipment = new Array<EquipmentDto>();
      }
      if (entry.equipment.length == 0) {
        entry.equipment.push(this.initializationService.getEmptyEquipmentDto());
      }
      entry.equipment.forEach((subentry: any) => {
        if (subentry.manufacturer == null || undefined) {
          subentry.manufacturer = this.initializationService.getEmptyContactDto();
        }
      });
      if (entry.influenceConditions == null || undefined) {
        entry.influenceConditions = new Array<ConditionDto>();
      }
      if (entry.influenceConditions.length == 0) {
        entry.influenceConditions.push(this.initializationService.getEmptyConditionDto());
      }
      if (entry.statements == null || undefined) {
        entry.statements = new Array<StatementDto>();
      }
      if (entry.statements.length == 0) {
        entry.statements.push(this.initializationService.getEmptyStatementDto());
      }
      entry.statements.forEach((statement: any) => {
        this.initializeStatement(statement);
      });
      if (entry.usedMethods == null || undefined) {
        entry.usedMethods = new Array<MethodDto>();
      }
      if (entry.usedMethods.length == 0) {
        entry.usedMethods.push(this.initializationService.getEmptyMethodDto());
      } else {
        entry.usedMethods.forEach((subentry: any) => {
          if (subentry.norms == null || undefined) {
            subentry.norms = new Array<string>();
          }
          if (subentry.norms.length == 0) {
            subentry.norms.push('');
          }
          if (subentry.description == null || undefined) {
            subentry.description = this.initializationService.getEmptyRichContentDto();
          }
          if (subentry.description.name == null || undefined) {
            subentry.description.name = this.initializationService.getEmptyLanguageSpecificStringsDto();
          }
          if (subentry.description.textContent == null || undefined) {
            subentry.description.textContent = this.initializationService.getEmptyLanguageSpecificStringsDto();
          }
        });
      }
      if (entry.results == null || undefined) {
        entry.results = new Array<ResultDto>();
      }
      if (entry.results.length == 0) {
        entry.results.push(this.initializationService.getEmptyResultDto());
      }
      entry.results.forEach((subentry: any) => {
        if (subentry.data == null || undefined) {
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
      statement.location.additionalInformation.textContent =
        this.initializationService.getEmptyLanguageSpecificStringsDto();
    }
    if (statement.responsibleAuthority == null || undefined) {
      statement.responsibleAuthority = this.initializationService.getEmptyContactDto();
    }
    if (statement.responsibleAuthority.location == null || undefined) {
      statement.responsibleAuthority.location = this.initializationService.getEmptyLocationDto();
    }
    if (statement.responsibleAuthority.location?.additionalInformation == null || undefined) {
      statement.responsibleAuthority.location.additionalInformation =
        this.initializationService.getEmptyRichContentDto();
    }
  }

  addEmptyItemDto() {
    this.dcc.administrativeData!.items!.push(this.initializationService.getEmptyItemDto());
  }

  addEmptyMeasurementResultDto() {
    this.dcc.measurementResults!.push(this.initializationService.getEmptyMeasurementResultDto());
  }

  ngAfterViewInit(): void {}

  convertBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const binaryData = reader.result as string;
          const base64String = btoa(binaryData);
          resolve(base64String);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }

  onFileSelected(fileData: ByteDataDto) {
    this.chosenFileData = fileData;
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
    this.attachFileToByteDataContent();
    this.dccService.jsonToXml(this.dcc).subscribe({
      next: (response: string) => {
        this.logger.trace('Got XML from dcc.jsonToXml: ' + response);
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(new Blob([response], { type: 'application/xml' }));
        a.href = objectUrl;
        a.download = this.dcc.administrativeData?.uniqueIdentifier + '.xml';
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      error: (error: any) => {
        this.showErrorMessages(error);
      },
    });
  }

  formula: FormulaDto | any = {
    id: '1',
    content: [
      '<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>x</mi><mo>+</mo><mi>y</mi><mo>=</mo><mi>z</mi></mrow></math>',
    ],
    type: FormulaDto.TypeEnum.Mathml,
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
  private updateStepState(): void {
    this.isLastStep = this.currentStepIndex === this.totalSteps - 1;
  }

  onStepChange(event: StepperSelectionEvent): void {
    if (event.selectedIndex === 4)
      this.onTabChange({ index: 0, tab: { textLabel: 'Human Readable' } } as MatTabChangeEvent);
    this.currentStepIndex = event.selectedIndex;
    this.updateStepState();
  }

  onTabChange(event: MatTabChangeEvent): void {
    if (event.index === 0) {
      this.loadHumanReadable();
    }
    if (event.index === 1) {
      this.loadXML();
    }
  }

  loadHumanReadable() {
    this.dccService.jsonToHtml(this.dcc, this.isInternal).subscribe({
      next: (response: string) => {
        setTimeout(() => {
          this.humanReadableHtml = response;
        }, 1000);
      },
      error: (error: any) => {
        this.showErrorMessages(error);
      },
      complete: () => {},
    });
  }

  loadPdf() {
    this.dccService.jsonToPdf(this.dcc, this.isInternal).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        this.pdfUrl = url;
      },
      error: (error: any) => {
        this.showErrorMessages(error);
      },
    });
  }

  loadXML() {
    this.dccService.jsonToXml(this.dcc).subscribe({
      next: (response: string) => {
        this.xml = response;
      },
      error: (error: any) => {
        this.showErrorMessages(error);
      },
    });
  }

  showErrorMessages(error: any) {
    this.errorService.logError(error);
  }
}
