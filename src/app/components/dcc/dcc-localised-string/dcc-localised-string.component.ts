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
import { Component, Input, OnInit, ChangeDetectorRef, AfterContentChecked, ViewEncapsulation } from "@angular/core";
import { LanguageSpecificStringsDto } from "src/app/generated/dcc/model/languageSpecificStringsDto";
import { LangTextPair } from "src/app/generated/dcc/model/langTextPair";

@Component({
  selector: "app-dcc-localised-string",
  templateUrl: "./dcc-localised-string.component.html",
  styleUrls: ["./dcc-localised-string.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DccLocalisedStringComponent implements OnInit, AfterContentChecked {
  @Input() strings: LanguageSpecificStringsDto;
  @Input() placeholder: string;
  @Input() templateButtonState!: boolean;
  @Input() isRequired!: boolean;
  selectedLang: string = "en";

  locales = [
    { lang: "de", name: "Deutsch", icon: "fi fi-de" },
    { lang: "en", name: "Englisch", icon: "fi fi-us" },
    { lang: "fr", name: "Français", icon: "fi fi-fr" },
    { lang: "es", name: "Español", icon: "fi fi-es" },
    { lang: "pt", name: "Português ", icon: "fi fi-br" },
  ];

  languageMap = new Map<string, any>();
  inputType: string | undefined;

  constructor(private cdref: ChangeDetectorRef) {
    this.strings = <LanguageSpecificStringsDto>{};
    this.placeholder = "";
  }

  ngOnInit(): void {
    if (!this.strings) {
      this.strings = this.getEmptyStringWithLangDto();
    }
    this.initializeLanguageMap();
    // this.updatePlaceholder()
  }

  ngAfterContentChecked() {
    // console.log('strings',this.strings)
    this.cdref.detectChanges();
  }

  initializeLanguageMap() {
    this.languageMap.clear();
    if (this.strings.content) {
      this.strings.content!.forEach((item) => {
        if (item.lang) {
          const locale = this.locales.find((locale) => locale.lang === item.lang);
          this.languageMap.set(item.lang, locale || this.locales[0]);
        }
      });
    }
  }

  getEmptyStringWithLangDto(): LanguageSpecificStringsDto {
    var result = <LanguageSpecificStringsDto>{};
    result.content = new Array<LangTextPair>();
    var preselected = <LangTextPair>{};
    preselected.lang = this.locales[0].lang;
    preselected.text = this.placeholder;
    result.content.push(preselected);
    return result;
  }

  getEmptyStringWithLangText(): LangTextPair {
    var result = <LangTextPair>{};
    result.lang = this.locales[0].lang;
    result.text = "";
    return result;
  }

  updateLanguageMap(item: LangTextPair) {
    if (item.lang) {
      const selectedLang = this.locales.find((locale) => locale.lang === item.lang);
      if (selectedLang) {
        this.languageMap.set(item.lang, selectedLang);
      } else {
        this.languageMap.set(item.lang, this.locales[2]);
      }
    }
  }
  getOrSetLang(item: any): string {
    if (item.lang === "**" || item.lang === undefined) {
      item.lang = "de";
    }
    return item.lang;
  }
}
