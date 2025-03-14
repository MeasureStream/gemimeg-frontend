import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-footer-privacy',
  templateUrl: './footer-privacy.component.html',
  styleUrls: ['./footer-privacy.component.scss']
})
export class FooterPrivacyComponent {
  constructor(private dialogRef: MatDialogRef<FooterPrivacyComponent>) { }

  closeDialog() {
    this.dialogRef.close();
  }
}
