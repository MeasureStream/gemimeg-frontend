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
import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
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

  constructor(private dccService: DccService, private renderer: Renderer2, private el: ElementRef, private cdr: ChangeDetectorRef, private titleService: Title) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['humanReadableHtml'] && this.humanReadableHtml !== '') {
      this.cdr.detectChanges();
      this.updateHtml();
    }
  }
  private updateHtml() {
    const wrapperDiv = this.el.nativeElement.querySelector('.wrapper-humanReadable');
    if (wrapperDiv) this.renderer.setProperty(wrapperDiv, 'innerHTML', this.humanReadableHtml);
    console.log(this.titleService.getTitle())
    if (this.titleService.getTitle() === "OP-Layer Web") {
      this.addLogos();
    }

  }
  addLogos() {
    const container = document.getElementById('logos-container');
    if (container) {
      container.innerHTML = `<div class="dcc-logos">
          <img class="ptb-logo" src="/assets/svg/PTB-black.svg" alt="ptb-logo"/>
          <img class="bundesadler-logo" src="/assets/svg/Bundesadler_Siegel.svg" alt="bundesadler-logo"/>
        </div>`;
    }
  }


  download(fileToDownload: boolean) {
    this.dccService.jsonToHuman(this.dcc).subscribe(
      {
        next: (response: string) => {

          this.humanReadableHtml = response;
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
