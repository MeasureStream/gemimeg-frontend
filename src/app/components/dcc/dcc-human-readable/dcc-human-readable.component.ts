import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CalibrationCertificateDto } from 'src/app/generated/dcc/model/calibrationCertificateDto';
import { DccService } from 'src/app/services/dcc/dcc.service';

@Component({
  selector: 'app-dcc-human-readable',
  templateUrl: './dcc-human-readable.component.html',
  styleUrls: ['./dcc-human-readable.component.scss'],
  // encapsulation: ViewEncapsulation.None

})
export class DccHumanReadableComponent implements OnChanges {
  @Input() humanReadableHtml: string = '';
  @Input() dcc!: CalibrationCertificateDto;
  isExpanded: boolean = true;

  constructor(private dccService: DccService, private renderer: Renderer2, private el: ElementRef, private cdr: ChangeDetectorRef) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['humanReadableHtml'] && this.humanReadableHtml !== '') {
      this.cdr.detectChanges();  // Manually trigger change detection
      this.updateHtml();
    }
  }
  private updateHtml() {
    const wrapperDiv = this.el.nativeElement.querySelector('.wrapper-humanReadable');
    if (wrapperDiv) this.renderer.setProperty(wrapperDiv, 'innerHTML', this.humanReadableHtml);
  }
  download(fileToDownload: boolean) {
    this.humanReadableHtml ?
      console.log('download started') : console.log('kein Zerti');
    console.log(this.dcc);

    this.dccService.jsonToHuman(this.dcc).subscribe(
      {
        next: (response: string) => {

          this.humanReadableHtml = response;
          console.log('download', this.humanReadableHtml);
          if (fileToDownload) {
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(new Blob([response], { type: "application/html" }));
            a.href = objectUrl;
            a.download = this.dcc.administrativeData!.uniqueIdentifier + ".html";
            a.click();
            URL.revokeObjectURL(objectUrl);
          }
        },
        error: (error: any) => {
          console.error("Fehler in jsonToHuman:", error);
          console.error("Fehler-Status:", error.status);
          console.error("Fehler-Message:", error.message);
          console.error("Fehler-Response:", error.error);
        },
        complete: () => { }
      }
    );
  }


  toggleCard() {
    this.isExpanded = !this.isExpanded
  }

}
