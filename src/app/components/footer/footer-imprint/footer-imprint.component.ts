import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-footer-imprint',
  templateUrl: './footer-imprint.component.html',
  styleUrls: ['./footer-imprint.component.scss']
})
export class FooterImprintComponent {
  constructor(private dialogRef: MatDialogRef<FooterImprintComponent>) { }

  closeDialog() {
    this.dialogRef.close();
  }
}
