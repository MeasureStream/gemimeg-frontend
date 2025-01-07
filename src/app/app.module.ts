import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { JwtModule } from '@auth0/angular-jwt';
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
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  NativeDateAdapter,
} from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KeycloakService } from './services/common/keycloak/keycloak.service';
import { TokenInterceptorService } from './services/common/token-interceptor/token-interceptor.service';

import { DccComponent } from './components/dcc/dcc.component';
import { DataproviderService } from './services/dataprovider/dataprovider.service';
import { DccService } from './services/dcc/dcc.service';
import { GenericFileUploadComponent } from './components/common/generic-file-upload/generic-file-upload.component';
import { DccLocalisedStringComponent } from './components/dcc/dcc-localised-string/dcc-localised-string.component';
import { DccContactComponent } from './components/dcc/dcc-contact/dcc-contact.component';
import { DccIdentificationsComponent } from './components/dcc/dcc-identifications/dcc-identifications.component';
import { DccSoftwareComponent } from './components/dcc/dcc-software/dcc-software.component';
import { DccUsedMethodsComponent } from './components/dcc/dcc-used-methods/dcc-used-methods.component';
import { DccMeasurementEquipmentComponent } from './components/dcc/dcc-measurement-equipment/dcc-measurement-equipment.component';
import { DccInfluenceConditionsComponent } from './components/dcc/dcc-influence-conditions/dcc-influence-conditions.component';
import { DccResultsComponent } from './components/dcc/dcc-results/dcc-results.component';
import { DccMeasurementMetadataComponent } from './components/dcc/dcc-measurement-metadata/dcc-measurement-metadata.component';
import { DccQuantityComponent } from './components/dcc/dcc-quantity/dcc-quantity.component';
import { DccDataComponent } from './components/dcc/dcc-data/dcc-data.component';
import { DccRichcontentComponent } from './components/dcc/dcc-richcontent/dcc-richcontent.component';
import { DccByteDataComponent } from './components/dcc/dcc-byte-data/dcc-byte-data.component';

import { MatTabsModule } from '@angular/material/tabs';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { ErrorComponent } from './components/common/error/error.component';
import { GlobalErrorHandler } from './utils/global.error.handler';
import { PageNotFoundComponent } from './components/common/not-found/page-not-found.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { VersionComponent } from './version/version.component';
import { MathmlComponent } from './mathml/mathml.component';
import { MathModule } from './mathml/math/math.module';

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
      let dayString = (day < 10 ? "0" : "") + day;
      let monthString = (month < 10 ? "0" : "") + month;
      let yearString = "" + year;
      return `${yearString}-${monthString}-${dayString}`;
    } else {
      return date.toDateString();
    }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    DccComponent,
    GenericFileUploadComponent,
    DccLocalisedStringComponent,
    DccContactComponent,
    DccIdentificationsComponent,
    DccSoftwareComponent,
    DccUsedMethodsComponent,
    DccMeasurementEquipmentComponent,
    DccInfluenceConditionsComponent,
    DccResultsComponent,
    DccMeasurementMetadataComponent,
    DccQuantityComponent,
    DccDataComponent,
    DccRichcontentComponent,
    DccByteDataComponent,
    ErrorComponent,
    PageNotFoundComponent,
    SimpleTestComponent,
    VersionComponent,
    MathmlComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
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
    })
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DataproviderService,
    DccService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
