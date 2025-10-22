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
import { Component, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { Overlay } from "@angular/cdk/overlay";
import { BehaviorSubject } from "rxjs";

type Language = { name: string; value: string };

@Component({
  selector: "app-language-settings-dialog",
  templateUrl: "./language-settings-dialog.component.html",
  styleUrls: ["./language-settings-dialog.component.scss"],
})
export class LanguageSettingsDialogComponent {
  heading: string;
  selectedLanguage!: string;

  displayLanguages = [
    { name: "Deutsch", value: "de" },
    { name: "English", value: "en" },
    { name: "Français", value: "fr" },
    { name: "Español", value: "es" },
    { name: "Português", value: "pt" },
    { name: "Italiano", value: "it" },
    { name: "Türkçe", value: "tr" },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: LanguageDialogData,
    private dialogRef: MatDialogRef<LanguageSettingsDialogComponent>
  ) {
    this.heading = data.heading;
    this.selectedLanguage = data.languageSubjects.value;
  }
  ngOnInit() {}
  closeDialog() {
    this.dialogRef.close();
  }

  applyLanguage() {
    this.data.languageSubjects.next(this.selectedLanguage);

    this.dialogRef.close(this.selectedLanguage);
    console.log(this.selectedLanguage);
  }
}

export function openLanguageDialog(
  dialog: MatDialog,
  overlay: Overlay,
  title: string,
  languageSubjects: BehaviorSubject<string>
) {
  (document.activeElement as HTMLElement)?.blur();
  const mainContent = document.querySelector("app-root") as HTMLElement;
  mainContent?.setAttribute("inert", "true");

  const config = new MatDialogConfig();
  config.autoFocus = false;
  config.restoreFocus = false;
  config.minHeight = "auto";
  config.minWidth = "400px";
  config.scrollStrategy = overlay.scrollStrategies.noop();
  config.data = { heading: title, languageSubjects: languageSubjects };

  const dialogRef = dialog.open(LanguageSettingsDialogComponent, config);

  dialogRef.afterClosed().subscribe(() => {
    mainContent?.removeAttribute("inert");
  });

  return dialogRef.afterClosed();
}

interface LanguageDialogData {
  heading: string;
  languageSubjects: BehaviorSubject<string>;
}
