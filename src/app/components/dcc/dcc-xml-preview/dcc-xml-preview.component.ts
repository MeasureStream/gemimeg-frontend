import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { CalibrationCertificateDto } from "src/app/generated/dcc/model/calibrationCertificateDto";

@Component({
  selector: "app-dcc-xml-preview",
  templateUrl: "./dcc-xml-preview.component.html",
  styleUrls: ["./dcc-xml-preview.component.scss"],
})
export class DccXmlPreviewComponent implements OnInit, OnChanges {
  @Input() xml!: string;
  @Input() dcc!: CalibrationCertificateDto;
  isExpanded: boolean = true;
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes["xml"]) {
    }
  }

  async download(fileToDownload: boolean) {
    if (fileToDownload) {
      const a = document.createElement("a");
      const objectUrl = URL.createObjectURL(new Blob([this.xml], { type: "application/html" }));
      a.href = objectUrl;
      a.download = "dcc.xml";
      a.click();
      URL.revokeObjectURL(objectUrl);
    }
  }
  toggleCard() {
    this.isExpanded = !this.isExpanded;
  }
}
