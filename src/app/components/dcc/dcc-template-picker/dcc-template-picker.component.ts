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
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { DccComponent } from "../dcc.component";
import { DccService } from "src/app/services/dcc/dcc.service";
import { CalibrationCertificateDto } from "src/app/generated/dcc/model/calibrationCertificateDto";
import { ErrorService } from "src/app/services/common/error/error.service";

@Component({
  selector: "app-dcc-template-picker",
  templateUrl: "./dcc-template-picker.component.html",
  styleUrls: ["./dcc-template-picker.component.scss"],
})
export class DccTemplatePickerComponent implements OnInit {
  templateFileUrl!: string;

  constructor(private parent: DccComponent, public dccService: DccService, private http: HttpClient, private errorService: ErrorService) {}

  ngOnInit(): void {}

  useTemplate() {
    this.parent.showEmptyStatement = true;
    this.http.get(this.templateFileUrl, { responseType: "text" }).subscribe({
      next: (xml: string) => {
        this.dccService.xmlToJson(xml.toString()).subscribe({
          next: (json: CalibrationCertificateDto) => {
            this.parent.dcc = this.parent.initialiseEmptyFields(this.cleanJson(json));
            // console.log(JSON.stringify(this.parent.dcc, null, 2))
            this.parent.loadHumanReadable();
            this.parent.loadXML();
          },
          error: (error: any) => {
            this.errorService.logError(error);
          },
          complete: () => {},
        });
      },
      error: (error: any) => {
        this.errorService.logError(error);
      },
      complete: () => {},
    });
  }
  cleanJson(json: any): any {
    if (typeof json === "string") {
      return this.cleanControllCharactersAndSpaces(json);
    } else if (Array.isArray(json)) {
      return json.map((item) => this.cleanJson(item));
    } else if (json !== null && typeof json === "object") {
      const cleanedObject: any = {};
      for (const key in json) {
        if (json.hasOwnProperty(key)) {
          // console.log('json[key', json[key]);
          cleanedObject[key] = this.cleanJson(json[key]);
        }
      }
      return cleanedObject;
    }
    return json;
  }

  cleanControllCharactersAndSpaces(text: string): string {
    let cleanedText = text?.replace(/[\t\n\r]+/g, " ");
    cleanedText = cleanedText.replace(/\s+/g, " ").trim();
    return cleanedText;
  }
}
