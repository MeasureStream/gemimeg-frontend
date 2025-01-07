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
  cipmForm!: FormGroup;
  addressForm!: FormGroup;
  cipm_id!: number;
  cipmTypes: string[] = ['CIPM-MRA / 391 00A p', 'CIPM-MRA / 391 00B p'];
  addressTypes: string[] = ['Braunschweig', 'Berlin-Adlershof', 'Berlin-Charlottenburg'];
  showEmptyStatement = false;
  cardTitles:string[]=['DCC-Software','Basis-Daten','Kunde','Verantwortliche-Personen','Kalibrierlabor','CIPM-MRA','Anschrift',
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
    this.cipmForm = this.formBuilder.group({
      cipmType: [null]
    });
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

  public getCIPMType() {
    return this.cipmForm.controls['cipmType'].value;
  }

  public getAddressType() {
    return this.addressForm.controls['addressType'].value;
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
    if (value === this.cipmTypes[0]) {
      statementToUpdate.references![0] = "391 00A p";
      statementToUpdate.references = [...statementToUpdate.references!];
      statementToUpdate.declaration!.textContent.content![0] = ({ lang: "de", text: "Die Physikalisch-Technische Bundesanstalt (PTB) in Braunschweig und Berlin ist das nationale Metrologieinstitut und die technische Oberbehörde der Bundesrepublik Deutschland für das Messwesen. Die PTB gehört zum Geschäftsbereich des Bundesministeriums für Wirtschaft und Klimaschutz. Sie erfüllt die Anforderungen an Kalibrier- und Prüflaboratorien auf der Grundlage der DIN EN ISO/IEC 17025." });
      statementToUpdate.declaration!.textContent.content![1] = ({ lang: "de", text: "Zentrale Aufgabe der PTB ist es, die gesetzlichen Einheiten in Übereinstimmung mit dem Internationalen Einheitensystem (SI) darzustellen, zu bewahren und weiterzugeben. Die PTB steht damit an oberster Stelle der metrologischen Hierarchie in Deutschland. Die Kalibrierscheine der PTB dokumentieren eine auf nationale Normale rückgeführte Kalibrierung." });
      statementToUpdate.declaration!.textContent.content![2] = ({ lang: "de", text: "Zur Sicherstellung der weltweiten Einheitlichkeit der Maßeinheiten arbeitet die PTB mit anderen nationalen metrologischen Instituten auf regionaler europäischer Ebene in EURAMET und auf internationaler Ebene im Rahmen der Meterkonvention zusammen. Dieses Ziel wird durch einen intensiven Austausch von Forschungsergebnissen und durch umfangreiche internationale Vergleichsmessungen erreicht." });
      statementToUpdate.declaration!.textContent.content![3] = ({ lang: "en", text: "The Physikalisch-Technische Bundesanstalt (PTB) in Braunschweig and Berlin is the National Metrology Institute and the supreme technical authority of the Federal Republic of Germany for metrology. The PTB comes under the auspices of the Federal Ministry for Economic Affairs and Climate Action. It meets the requirements for calibration and testing laboratories as defined in DIN EN ISO/IEC 17025." });
      statementToUpdate.declaration!.textContent.content![4] = ({ lang: "en", text: "The central task of PTB is to realize, to maintain and to disseminate the legal units in compliance with the International System of Units (SI). PTB thus is at the top of the metrological hierarchy in Germany. The calibration certificates issued by PTB document a calibration traceable to national measurement standards." });
      statementToUpdate.declaration!.textContent.content![5] = ({ lang: "en", text: "PTB cooperates with other national metrology institutes - at the regional European level within EURAMET and at the international level within the framework of the Metre Convention - with the aim of ensuring the worldwide coherence of the measurement units. This aim is achieved by an intensive exchange of the results of research work and by comprehensive international comparison measurements." });
    } else {
      statementToUpdate.references![0] = "391 00B p";
      statementToUpdate.references = [...statementToUpdate.references!];
      statementToUpdate.declaration!.textContent.content![0] = ({ lang: "de", text: "Die Physikalisch-Technische Bundesanstalt(PTB) in Braunschweig und Berlin ist das nationale Metrologieinstitut und die technische Oberbehörde der Bundesrepublik Deutschland für das Messwesen. Die PTB gehört zum Geschäftsbereich des Bundesministeriums für Wirtschaft und Klimaschutz. Sie erfüllt die Anforderungen an Kalibrier- und Prüflaboratorien auf der Grundlage der DIN EN ISO/IEC 17025." });
      statementToUpdate.declaration!.textContent.content![1] = ({ lang: "de", text: "Zentrale Aufgabe der PTB ist es, die gesetzlichen Einheiten in Übereinstimmung mit dem Internationalen Einheitensystem (SI) darzustellen, zu bewahren und weiterzugeben. Die PTB steht damit an oberster Stelle der metrologischen Hierarchie in Deutschland. Die Kalibrierscheine der PTB dokumentieren eine auf nationale Normale rückgeführte Kalibrierung." });
      statementToUpdate.declaration!.textContent.content![2] = ({ lang: "de", text: "Dieser Ergebnisbericht ist in Übereinstimmung mit den Kalibrier- und Messmöglichkeiten (CMCs), wie sie im Anhang C des gegenseitigen Abkommens (MRA) des Internationalen Komitees für Maße und Gewichte enthalten sind. Im Rahmen des MRA wird die Gültigkeit der Ergebnisberichte von allen teilnehmenden Instituten für die im Anhang C spezifizierten Messgrößen, Messbereiche und Messunsicherheiten gegenseitig anerkannt (nähere Informationen unter http://www.bipm.org)." });
      statementToUpdate.declaration!.textContent.content![3] = ({ lang: "de", text: "Diese Aussage und das CIPM-MRA-Logo beziehen sich nur auf die Messergebnisse in diesem Kalibrierschein." });
      statementToUpdate.declaration!.textContent.content![4] = ({ lang: "en", text: "The Physikalisch-Technische Bundesanstalt(PTB) in Braunschweig and Berlin is the National Metrology Institute and the supreme technical authority of the Federal Republic of Germany for metrology. The PTB comes under the auspices of the Federal Ministry for Economic Affairs and Climate Action. It meets the requirements for calibration and testing laboratories as defined in DIN EN ISO/IEC 17025." });
      statementToUpdate.declaration!.textContent.content![5] = ({ lang: "en", text: "The central task of PTB is to realize, to maintain and to disseminate the legal units in compliance with the International System of Units (SI). PTB thus is at the top of the metrological hierarchy in Germany. The calibration certificates issued by PTB document a calibration traceable to national measurement standards." });
      statementToUpdate.declaration!.textContent.content![6] = ({ lang: "en", text: "This certificate is consistent with the Calibration and Measurement Capabilities (CMCs) that are included in Appendix C of the Mutual Recognition Arrangement (MRA) drawn up by the International Committee for Weights and Measures (CIPM). Under the MRA, all participating institutes recognize the validity of each other’s calibration and measurement certificates for the quantities, ranges and measurement uncertainties specified in Appendix C (for details, see http://www.bipm.org)." });
      statementToUpdate.declaration!.textContent.content![7] = ({ lang: "en", text: "The CIPM MRA Logo and this statement attest only to the measurement component of the certificate." });
      statementToUpdate.declaration!.byteDataContent = <ByteDataDto>{};
      statementToUpdate.declaration!.byteDataContent.fileName = "CIPM_MRA.png";
      statementToUpdate.declaration!.byteDataContent.mimeType = "image/png";
      statementToUpdate.declaration!.byteDataContent.content = "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";
    }
    if (isCipmAdded) {
      console.log("statements delete",this.dcc.administrativeData?.statements)
      this.dcc.administrativeData!.statements!.splice(cipmIndex!, 1, statementToUpdate);

    } else {
      console.log("statements-push",this.dcc.administrativeData?.statements);
      this.addExpandedInMetadataComponent();
      this.dcc.administrativeData!.statements!.push(statementToUpdate);

    }
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
    if (value === this.addressTypes[0]) { /* Braunschweig */
      statementToUpdate.location!.street! = "Bundesallee";
      statementToUpdate.location!.houseNumber! = "100";
      statementToUpdate.location!.postalCode! = "38116";
      statementToUpdate.location!.city! = "Braunschweig";
      statementToUpdate.location!.countryCode! = "DE";
    } else if (value === this.addressTypes[1]) { /* Berlin-Adlershof */
      statementToUpdate.location!.street! = "Magnusstraße";
      statementToUpdate.location!.houseNumber! = "9";
      statementToUpdate.location!.postalCode! = "12489";
      statementToUpdate.location!.city! = "Berlin";
      statementToUpdate.location!.countryCode! = "DE";
    } else { /* Berlin-Charlottenburg */
      statementToUpdate.location!.street! = "Abbestraße";
      statementToUpdate.location!.houseNumber! = "2-12";
      statementToUpdate.location!.postalCode! = "10587";
      statementToUpdate.location!.city! = "Berlin";
      statementToUpdate.location!.countryCode! = "DE";
    }
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

  ngAfterViewInit(): void {
    this.ObjectsService.getWorklist().subscribe(response => {
      this.procedures = response;
    })
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

  testJson = {
    administrativeData: {
      dccSoftware: [
        {
          name: {
            content: [
              {
                lang: "es",
                text: "Supersoftware"
              }
            ]
          },
          version: "v1.0.0"
        }
      ],
      customer: {
        name: {
          content: [
            {
              lang: "de",
              text: "Samuel Eickelberg"
            }
          ]
        },
        location: {
          countryCode: "DE",
          stateCode: "Berlin",
          city: "Berlin",
          street: "Abbestr.",
          houseNumber: "2-12"
        },
        emailAddress: "samuel.eickelberg@ptb.de"
      },
      calibrationLaboratory: {
        calibrationLaboratoryCode: "PTB-9.4",
        contact: {
          name: {
            content: [
              {
                lang: "de",
                text: "PTB Fachbereich 9.4"
              }
            ]
          },
          location: {
            countryCode: "DE",
            stateCode: "Berlin",
            city: "Berlin",
            street: "Abbestr.",
            houseNumber: "2-12"
          },
          emailAddress: "samuel.eickelberg@ptb.de"
        }
      },
      items: [
        {
          name: {
            content: [
              {
                lang: "de",
                text: "Messgerät 1"
              }
            ]
          },
          description: {
            name: {
              content: [
                {
                  lang: "de",
                  text: "etwas text"
                },
                {
                  lang: "en",
                  text: "some text"
                },
                {
                  lang: "fr",
                  text: "quelques textes"
                }
              ]
            }
          },
          model: "Messgerät 1",
          manufacturer: {
            name: {
              content: [
                {
                  lang: "de",
                  text: "Samuel Eickelberg"
                }
              ]
            },
            location: {
              id: "67890",
              countryCode: "DE",
              stateCode: "BE",
              city: "Berlin",
              postalCode: "10115",
              street: "Invalidenstraße",
              houseNumber: "43",
              poBox: "1234",
              additionalInformation: {}
            },
            emailAddress: "samuel.eickelberg@ptb.de"
          },
          classId: "Waage",
          classReference: "Waage",
          identifications: [
            {
              issuer: "calibrationLaboratory",
              value: "PTB"
            }
          ]
        }
      ],
      uniqueIdentifier: "PTB-9.4-test",
      countryCode: "DE",
      languageCodes: new Set([
        "de"
      ]),
      receiptDate: "2022-09-09",
      startDate: "2022-10-01",
      endDate: "2022-10-01",
      performanceLocation: "laboratory",
      responsiblePersons: [
        {
          name: {
            content: [
              {
                lang: "de",
                text: "Samuel Eickelberg"
              }
            ]
          },
          emailAddress: "samuel.eickelberg@ptb.de"
        }
      ],
      statements: [
        {
          name: {
            content: [
              {
                lang: "de",
                text: "state2"
              }
            ]
          },
          description: {
            name: {
              content: [
                {
                  lang: "de",
                  text: "state1"
                },
                {
                  lang: "en",
                  text: "state1"
                },
                {
                  lang: "fr",
                  text: "state1"
                }
              ]
            }
          },
          data: [

            {
              formula: {
                refTypes: [
                  "basic_guardBand"
                ],
                 content: "dz1V",
                 type: FormulaDto.TypeEnum.Mathml
              }
            },
            {
              byteData: {
                name: {
                  content: [
                    {
                      lang: "de",
                      text: "state1"
                    },
                    {
                      lang: "en",
                      text: "state1"
                    },
                    {
                      lang: "fr",
                      text: "state1"
                    }
                  ]
                },
                mimeType: "pdf",
                fileName: "testfile"
              }
            }

          ],
          declaration: {
            name: {
              content: [
                {
                  lang: "de",
                  text: "state2"
                },
                {
                  lang: "en",
                  text: "state2"
                },
                {
                  lang: "fr",
                  text: "state2"
                }
              ]
            }
          },
          countryCodes: [
            "DE"
          ],
          traceable: true,
          date: "2022-09-09",
          valid: true
        }
      ]
    },
    measurementResults: [
      {
        name: {
          content: [
            {
              lang: "de",
              text: "1 kg"
            }
          ]
        },
        results: [
          {
            name: {
              content: [
                {
                  lang: "de",
                  text: "1 kg"
                }
              ]
            },
            data: [
              {
                list: {
                  quantities: [
                    {
                      dimension: {
                        value: 1.0,
                        unit: "kg"
                      },
                      quantityTypeName: "real"
                    }
                  ]
                }
              }
            ]
          }
        ],
        statements: [
          {
            id: "a1111",
            name: {
              content: [
                {
                  lang: "de",
                  text: "dummy1"
                }
              ]
            },
            description: {
              name: {
                content: [
                  {
                    lang: "de",
                    text: "desc11"
                  },
                  {
                    lang: "en",
                    text: "desc12"
                  },
                  {
                    lang: "fr",
                    text: "desc13"
                  }
                ]
              }
            },
            declaration: {
              name: {
                content: [
                  {
                    lang: "de",
                    text: "dec11"
                  },
                  {
                    lang: "en",
                    text: "dec12"
                  },
                  {
                    lang: "fr",
                    text: "dec13"
                  }
                ]
              }
            },
            countryCodes: ["GR", "AU"],
            convention: "Konvention1",
            traceable: true,
            norms: ["norm11", "norm12", "norm13"],
            references: ["ref11", "ref12"],
            valid: true,
            date: "2024-09-17",
            conformity: "pass",
            location: {
              id: "111111",
              countryCode: "DE",
              stateCode: "BE",
              city: "Berlin1",
              postalCode: "11111",
              street: "Invalidenstraße",
              houseNumber: "111",
              poBox: "111111",
              additionalInformation: {
                name: {
                  content: [
                    {
                      lang: "de",
                      text: "weitere Infos11"
                    },
                    {
                      lang: "en",
                      text: "weitere Infos12"
                    },
                    {
                      lang: "fr",
                      text: "weitere Infos13"
                    }
                  ]
                }
              }
            },
            onSIDefinition: "nonSIDefinition",
            nonSIUnit: "minute",
            responsibleAuthority: {
              name: {
                content: [
                  {
                    lang: "de",
                    text: "resp-person"
                  }
                ]
              },
              phoneNumber: "49123456789",
              location: {
                id: "67890",
                countryCode: "DE",
                stateCode: "BE",
                city: "Berlin",
                postalCode: "10115",
                street: "Invalidenstraße",
                houseNumber: "43",
                poBox: "1234",
                additionalInformation: {
                  name: {
                    content: [
                      {
                        lang: "de",
                        text: "resp 1 text"
                      },
                      {
                        lang: "en",
                        text: "resp 1 text"
                      },
                      {
                        lang: "fr",
                        text: "resp 1 textes"
                      }
                    ]
                  }
                }
              },
              emailAddress: "john.doe@example.com"
            },
            period: "P24Y09M17DT10H00M00S"
          },
          {
            id: "a222",
            name: {
              content: [
                {
                  lang: "de",
                  text: "dummy2"
                }
              ]
            },
            description: {
              name: {
                content: [
                  {
                    lang: "de",
                    text: "desc21"
                  },
                  {
                    lang: "en",
                    text: "desc22"
                  },
                  {
                    lang: "fr",
                    text: "desc23"
                  }
                ]
              }
            },
            declaration: {
              name: {
                content: [
                  {
                    lang: "de",
                    text: "dec21"
                  },
                  {
                    lang: "en",
                    text: "dec22"
                  },
                  {
                    lang: "fr",
                    text: "dec23"
                  }
                ]
              }
            },
            countryCodes: ["AW", "AU"],
            convention: "Konvention2",
            traceable: true,
            norms: ["norm21", "norm22", "norm23"],
            references: ["ref21", "ref22"],
            valid: true,
            date: "2024-09-17",
            conformity: "pass",
            location: {
              id: "67890",
              countryCode: "DE",
              stateCode: "BE",
              city: "Berlin",
              postalCode: "10115",
              street: "Invalidenstraße",
              houseNumber: "43",
              poBox: "1234",
              additionalInformation: {

                name: {
                  content: [
                    {
                      lang: "de",
                      text: "weitere Infos1"
                    },
                    {
                      lang: "en",
                      text: "weitere Infos2"
                    },
                    {
                      lang: "fr",
                      text: "weitere Infos3"
                    }
                  ]

                }
              }
            },
            onSIDefinition: "nonSIDefinition",
            nonSIUnit: "minute",
            responsibleAuthority: {
              name: {
                content: [
                  {
                    lang: "de",
                    text: "resp-person"
                  }
                ]
              },
              phoneNumber: "49123456789",
              location: {
                id: "67890",
                countryCode: "DE",
                stateCode: "BE",
                city: "Berlin",
                postalCode: "10115",
                street: "Invalidenstraße",
                houseNumber: "43",
                poBox: "1234",
                additionalInformation: {
                  name: {
                    content: [
                      {
                        lang: "de",
                        text: "resp2 text"
                      },
                      {
                        lang: "en",
                        text: "resp2 text"
                      },
                      {
                        lang: "fr",
                        text: "resp2 textes"
                      }
                    ]
                  }

                }
              },
              emailAddress: "john.doe@example.com"
            },
            period: "P24Y09M17DT10H00M00S"
          },
        ],
      }
    ],
    schemaVersion: "3.2.1",
  };
}


