import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-footer-licence',
  templateUrl: './footer-licence.component.html',
  styleUrls: ['./footer-licence.component.scss']
})
export class FooterLicenceComponent {
  constructor(private dialogRef: MatDialogRef<FooterLicenceComponent>) { }

  closeDialog() {
    this.dialogRef.close();
  }
}
