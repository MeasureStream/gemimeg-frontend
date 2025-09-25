import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  AfterViewInit,
  ElementRef,
  ViewChild,
  AfterViewChecked,
} from "@angular/core";
import { DomSanitizer, SafeHtml, Title } from "@angular/platform-browser";
import { CalibrationCertificateDto } from "src/app/generated/dcc/model/calibrationCertificateDto";
declare var Prism: any;

@Component({
  selector: "app-dcc-xml-preview",
  templateUrl: "./dcc-xml-preview.component.html",
  styleUrls: ["./dcc-xml-preview.component.scss"],
})
export class DccXmlPreviewComponent
  implements OnInit, OnChanges, AfterViewChecked
{
  @Input() dcc!: CalibrationCertificateDto;
  @Input() rawXml: string = "";
  @Input() idPrefix!: string;
  @ViewChild("codeBlock") codeBlock!: ElementRef;
  isExpanded: boolean = true;
  isOPLayer: boolean = false;
  highlightedXml: SafeHtml = "";
  private lastRenderedXml = "";
  constructor(private sanitizer: DomSanitizer, private titleService: Title) {
    if (this.titleService.getTitle() === "OP-Layer Web") {
      this.isOPLayer = true;
    }
  }

  ngOnInit(): void {
    const escaped = this.escapeXml(this.rawXml);
    this.highlightedXml = this.sanitizer.bypassSecurityTrustHtml(escaped);
  }
  ngAfterViewChecked() {
    // Re-render only if XML changed
    if (this.rawXml && this.rawXml !== this.lastRenderedXml) {
      const escaped = this.escapeXml(this.rawXml);
      this.highlightedXml = this.sanitizer.bypassSecurityTrustHtml(escaped);
      this.lastRenderedXml = this.rawXml;

      // Wait for DOM update before highlighting
      setTimeout(() => {
        if (this.codeBlock?.nativeElement) {
          Prism.highlightElement(this.codeBlock.nativeElement);
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["rawXml"]) {
    }
  }

  async download(fileToDownload: boolean) {
    if (fileToDownload) {
      const a = document.createElement("a");
      const objectUrl = URL.createObjectURL(
        new Blob([this.rawXml], { type: "application/html" })
      );
      a.href = objectUrl;
      a.download = "dcc.xml";
      a.click();
      URL.revokeObjectURL(objectUrl);
    }
  }

  toggleCard() {
    this.isExpanded = !this.isExpanded;
  }

  private escapeXml(xml: string): string {
    if (!xml) {
      return ""; // or return some default/fallback
    }
    return xml
      .replace(/&/g, "&amp;") // Must come first
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;") // Optional, but good for attributes
      .replace(/#/g, "&#35;")
      .replace(/#/g, "&#39;");
  }
}
