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
import { Component, EventEmitter, Output } from "@angular/core";

import { NavigationComponent } from "../navigation/navigation.component";
import { GlobalLanguageService } from "src/app/services/common/languages/globalLanguage.service";

@Component({
  selector: "app-global-language-dialog",
  templateUrl: "./global-language-dialog.component.html",
  styleUrls: ["./global-language-dialog.component.scss"],
})
export class GlobalLanguageDialogComponent {
  @Output() close = new EventEmitter<void>();

  displaylanguages: Array<Language>;
  userLanguage: string;

  constructor(
    private navigation: NavigationComponent,
    private globalLanguageService: GlobalLanguageService
  ) {
    this.displaylanguages = new Array<Language>();
    this.displaylanguages[0] = <Language>{};
    this.displaylanguages[0].name = "Deutsch";
    this.displaylanguages[0].value = "de";
    this.displaylanguages[1] = <Language>{};
    this.displaylanguages[1].name = "English";
    this.displaylanguages[1].value = "en";
    this.displaylanguages[2] = <Language>{};
    this.displaylanguages[2].name = "Français";
    this.displaylanguages[2].value = "fr";
    this.displaylanguages[3] = <Language>{};
    this.displaylanguages[3].name = "Español";
    this.displaylanguages[3].value = "es";
    this.displaylanguages[4] = <Language>{};
    this.displaylanguages[4].name = "Português";
    this.displaylanguages[4].value = "pt";
    this.displaylanguages[5] = <Language>{};
    this.displaylanguages[5].name = "Italiano";
    this.displaylanguages[5].value = "it";
    this.displaylanguages[6] = <Language>{};
    this.displaylanguages[6].name = "Türkçe";
    this.displaylanguages[6].value = "tr";
    this.userLanguage = this.navigation.getUserLanguage();
  }

  ngOnInit(): void {}

  applyLanguage(): void {
    this.navigation.setUserLanguage(this.userLanguage);
    this.globalLanguageService.setLanguage(this.userLanguage);
    this.closeDialog();
  }

  closeDialog(): void {
    this.close.emit();
  }
}

export interface Language {
  name: string;
  value: string;
}
