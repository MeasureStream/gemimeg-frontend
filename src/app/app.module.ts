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
import { ErrorHandler, NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { AppRoutingModule } from './app-routing.module';
import { NgxTranslateModule } from './translate/translate.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/common/navigation/navigation.component';
import { DccComponent } from './components/dcc/dcc.component';
import { DccService } from './services/dcc/dcc.service';
import { DccLocalisedStringComponent } from './components/dcc/dcc-localised-string/dcc-localised-string.component';
import { DccContactComponent } from './components/dcc/dcc-contact/dcc-contact.component';
import { DccHumanReadableComponent } from './components/dcc/dcc-human-readable/dcc-human-readable.component';
import { DccSoftwareComponent } from './components/dcc/dcc-software/dcc-software.component';
import { DccUsedMethodsComponent } from './components/dcc/dcc-used-methods/dcc-used-methods.component';
import { DccMeasurementEquipmentComponent } from './components/dcc/dcc-measurement-equipment/dcc-measurement-equipment.component';
import { DccInfluenceConditionsComponent } from './components/dcc/dcc-influence-conditions/dcc-influence-conditions.component';
import { DccResultsComponent } from './components/dcc/dcc-results/dcc-results.component';
import { DccMeasurementMetadataComponent } from './components/dcc/dcc-measurement-metadata/dcc-measurement-metadata.component';
import { DccQuantityComponent } from './components/dcc/dcc-quantity/dcc-quantity.component';
import { DccDataComponent } from './components/dcc/dcc-data/dcc-data.component';
import { DccRichContentComponent } from './components/dcc/dcc-richcontent/dcc-richcontent.component';
import { DccByteDataComponent } from './components/dcc/dcc-byte-data/dcc-byte-data.component';
import { DccUploadComponent } from './components/dcc/dcc-upload/dcc-upload.component';
import { DccDownloadComponent } from './components/dcc/dcc-download/dcc-download.component';
import { DccResponsiblePersonComponent } from './components/dcc/dcc-responsible-person/dcc-responsible-person.component';
import { DccTemplatePickerComponent } from './components/dcc/dcc-template-picker/dcc-template-picker.component';
import { DccLocationComponent } from './components/dcc/dcc-location/dcc-location.component';
import { DccManufacturerComponent } from './components/dcc/dcc-manufacturer/dcc-manufacturer.component';
import { DccItemListComponent } from './components/dcc/dcc-item-list/dcc-item-list.component';
import { DccItemComponent } from './components/dcc/dcc-item/dcc-item.component';
import { DccIdentificationComponent } from './components/dcc/dcc-identification/dcc-identification.component';
import { DccInstalledSoftwareListComponent } from './components/dcc/dcc-software-list/dcc-software-list.component';
import { DccIdentificationListComponent } from './components/dcc/dcc-identification-list/dcc-identification-list.component';
import { DccMeasuringResultsComponent } from './components/dcc/dcc-measuring-results/dcc-measuring-results.component';
import { DccXmlPreviewComponent } from './components/dcc/dcc-xml-preview/dcc-xml-preview.component';
import { DccAttachmentUploadComponent } from './components/dcc/dcc-attachment-upload/dcc-attachment-upload.component';

import { InfoButtonComponent } from './components/common/info-button/info-button.component';
import { InfoDialogComponent } from './components/common/info-dialog/info-dialog.component';
import { SettingsDialogComponent } from './components/common/settings-dialog/settings-dialog.component';
import { ErrorComponent } from './components/common/error/error.component';
import { FooterComponent } from './components/footer/footer.component';
import { FooterImprintComponent } from './components/footer/footer-imprint/footer-imprint.component';
import { FooterPrivacyComponent } from './components/footer/footer-privacy/footer-privacy.component';
import { FooterLicenceComponent } from './components/footer/footer-licence/footer-licence.component';
import { GlobalErrorHandler } from './utils/global.error.handler';
import { PageNotFoundComponent } from './components/common/not-found/page-not-found.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SimpleTestComponent } from './simple-test/simple-test.component';
import { VersionComponent } from './version/version.component';

import { MathModule } from './components/common/math/math.module';
import { MathComponent } from './components/common/math/math.component';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: { day: 'numeric', month: 'numeric', year: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

export class AppDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      let dayString = (day < 10 ? '0' : '') + day;
      let monthString = (month < 10 ? '0' : '') + month;
      let yearString = '' + year;
      return `${yearString}-${monthString}-${dayString}`;
    } else {
      return date.toDateString();
    }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    DccComponent,
    DccLocalisedStringComponent,
    DccContactComponent,
    DccHumanReadableComponent,
    DccSoftwareComponent,
    DccUsedMethodsComponent,
    DccMeasurementEquipmentComponent,
    DccIdentificationListComponent,
    DccInfluenceConditionsComponent,
    DccResultsComponent,
    DccMeasurementMetadataComponent,
    DccQuantityComponent,
    DccDataComponent,
    DccRichContentComponent,
    DccByteDataComponent,
    DccUploadComponent,
    DccDownloadComponent,
    DccResponsiblePersonComponent,
    DccTemplatePickerComponent,
    ErrorComponent,
    FooterComponent,
    FooterImprintComponent,
    FooterPrivacyComponent,
    FooterLicenceComponent,
    PageNotFoundComponent,
    SimpleTestComponent,
    VersionComponent,
    MathComponent,
    DccRichContentComponent,
    DccByteDataComponent,
    DccXmlPreviewComponent,
    DccLocationComponent,
    DccManufacturerComponent,
    DccItemListComponent,
    DccItemComponent,
    DccIdentificationComponent,
    DccInstalledSoftwareListComponent,
    DccMeasuringResultsComponent,
    InfoButtonComponent,
    InfoDialogComponent,
    SettingsDialogComponent,
    DccAttachmentUploadComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatDividerModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MathModule,
    MatSnackBarModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.TRACE,
      serverLogLevel: NgxLoggerLevel.OFF,
    }),
    NgxTranslateModule,
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DccService,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
