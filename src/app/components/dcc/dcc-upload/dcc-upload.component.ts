import { Component } from '@angular/core';

import { DccComponent } from '../dcc.component';
import { CalibrationCertificateDto } from 'src/app/generated/dcc/model/calibrationCertificateDto';
import { DccService } from 'src/app/services/dcc/dcc.service';
import { ErrorService } from 'src/app/services/common/error/error.service';

@Component({
  selector: 'app-dcc-upload',
  templateUrl: './dcc-upload.component.html',
  styleUrls: ['./dcc-upload.component.scss']
})
export class DccUploadComponent {
  reader = new FileReader();
  xml = '';

  constructor(private parent: DccComponent, private dccService: DccService, private errorService: ErrorService) {
    this.reader.addEventListener("load", () => {
      this.xml = this.reader.result as string;
    }, false);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.name.endsWith('.xml')) {
      this.reader.readAsText(file);
      this.dccService.xmlToJson(this.xml).subscribe({
        next: (json: CalibrationCertificateDto) => {
          this.parent.dcc = this.parent.initialiseEmptyFields(json);
        },
        error: (error: any) => {
          this.errorService.logError(error);
        },
        complete: () => {}
      });
    }
  }
}
