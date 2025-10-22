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
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LanguagesService {
  userLanguage = Intl.DateTimeFormat().resolvedOptions().locale.split("-")[0];
  mandatoryLanguages: string[] = [];
  usedLanguages: string[] = [];
  private mandatoryLanguageSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>(this.userLanguage);
  private usedLanguageSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>(this.userLanguage);

  public mandatoryLanguage: Observable<string> =
    this.mandatoryLanguageSubject.asObservable();
  public usedLanguage: Observable<string> =
    this.usedLanguageSubject.asObservable();

  constructor() {
    this.setDefaultValues();
  }

  getMandatoryLangSubject() {
    return this.mandatoryLanguageSubject;
  }

  getUsedLangSubject() {
    return this.usedLanguageSubject;
  }

  getMandatoryLang() {
    return this.mandatoryLanguageSubject.value;
  }
  setMandatoryLang(lang: string) {
    this.mandatoryLanguageSubject.next(lang);
  }
  addMandatoryLanguage(lang: string) {
    if (!this.mandatoryLanguages.includes(lang)) {
      this.mandatoryLanguages.push(lang);
    }
  }
  removeMandatoryLanguage(lang: string) {
    this.mandatoryLanguages = this.mandatoryLanguages.filter(
      (language) => language !== lang
    );
  }

  getMandatoryLanguages() {
    return this.mandatoryLanguages;
  }
  addUsedLanguage(lang: string) {
    if (!this.usedLanguages.includes(lang)) {
      this.usedLanguages.push(lang);
    }
  }
  removeUsedLanguage(lang: string) {
    this.usedLanguages = this.usedLanguages.filter(
      (language) => language !== lang
    );
  }
  getUsedLanguages() {
    return this.usedLanguages;
  }
  setDefaultValues(mandatoryLanguages?: string[], usedLanguages?: string[]) {
    this.mandatoryLanguages = mandatoryLanguages ?? [this.userLanguage];
    this.usedLanguages = usedLanguages ?? [this.userLanguage];
  }
}
