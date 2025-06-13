import { Component } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';

import { FooterImprintComponent } from './footer-imprint/footer-imprint.component';
import { FooterPrivacyComponent } from './footer-privacy/footer-privacy.component';
import { FooterLicenceComponent } from './footer-licence/footer-licence.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  currentStepIndex = 0;
  totalSteps = 4;
  isLastStep = false;
  stepper: MatStepper | any;

  constructor(public dialog: MatDialog) {}

  openImprintModal() {
    this.dialog.open(FooterImprintComponent, {
      height: '45%',
    });
  }

  openPrivacyModal() {
    this.dialog.open(FooterPrivacyComponent, {
      width: '75%',
      height: '80%',
    });
  }

  openLizenzModal() {
    this.dialog.open(FooterLicenceComponent, {
      height: '70%',
      width: '50%',
    });
  }
}
