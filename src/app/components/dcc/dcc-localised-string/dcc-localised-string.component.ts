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
import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  AfterContentChecked,
  ViewEncapsulation,
} from "@angular/core";
import { LanguageSpecificStringsDto } from "src/app/generated/dcc/model/languageSpecificStringsDto";
import { LangTextPair } from "src/app/generated/dcc/model/langTextPair";
import { LanguageService } from "src/app/services/common/language/language.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-dcc-localised-string",
  templateUrl: "./dcc-localised-string.component.html",
  styleUrls: ["./dcc-localised-string.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DccLocalisedStringComponent
  implements OnInit, AfterContentChecked
{
  @Input() strings: LanguageSpecificStringsDto;
  @Input() placeholder: string;
  @Input() type: string = "NAME"; // 'NAME' or 'CONTENT', if not provided, defaults to 'NAME'.
  @Input() templateButtonState!: boolean;
  @Input() isRequired!: boolean;
  @Input() idPrefix!: string;
  selectedLang: string = "en";
  currentLanguage: string = "";
  private langSub!: Subscription;

  locales = [
    { lang: "en", name: "English", icon: "fi fi-gb" },
    { lang: "de", name: "Deutsch", icon: "fi fi-de" },
    { lang: "fr", name: "Français", icon: "fi fi-fr" },
    { lang: "es", name: "Español", icon: "fi fi-es" },
    { lang: "pt", name: "Português", icon: "fi fi-br" },
    { lang: "it", name: "Italiano", icon: "fi fi-it" },
    { lang: "tr", name: "Türkçe", icon: "fi fi-tr" },
  ];

  languageMap = new Map<string, any>();
  inputType: string | undefined;

  constructor(
    private cdref: ChangeDetectorRef,
    private languageService: LanguageService
  ) {
    this.strings = <LanguageSpecificStringsDto>{};
    this.placeholder = "";
  }

  ngOnInit(): void {
    if (!this.strings) {
      this.strings = this.getEmptyStringWithLangDto();
    }
    this.strings.content?.forEach((item) => {
      if (!item.lang || item.lang === "**") {
        item.lang = "de";
      }
    });
    this.langSub = this.languageService.language.subscribe((lang) => {
      this.currentLanguage = lang;
      this.updateEmptyItemLangs();
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getLocale(lang?: string) {
    return (
      this.locales.find((locale) => locale.lang == lang) || this.locales[5]
    );
  }

  updateEmptyItemLangs() {
    this.strings.content?.forEach((item) => {
      if (!item.text || item.text.trim() === "") {
        item.lang = this.currentLanguage;
      }
    });
  }

  updateLanguageMap(item: LangTextPair) {
    if (item.lang) {
      const selectedLocale = this.locales.find(
        (locale) => locale.lang === item.lang
      );
      console.log("selectedLocale: ", selectedLocale);
      if (selectedLocale) {
        this.languageMap.set(item.lang, selectedLocale);
      } else {
        this.languageMap.set(item.lang, this.locales[2]);
      }
    }
  }

  getEmptyStringWithLangDto(): LanguageSpecificStringsDto {
    var result = <LanguageSpecificStringsDto>{};
    result.id = "";
    result.refIds = [];
    result.content = new Array<LangTextPair>();
    var preselected = this.getEmptyStringWithLangText();
    preselected.lang = this.locales[0].lang;
    preselected.text = "";
    result.content.push(preselected);
    return result;
  }

  getEmptyStringWithLangText(): LangTextPair {
    var result = <LangTextPair>{};
    result.id = "";
    result.refIds = [];
    result.refTypes = [];
    result.lang = this.currentLanguage;
    result.text = "";
    return result;
  }
}
