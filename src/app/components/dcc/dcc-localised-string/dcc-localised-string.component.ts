
import { Component, Input, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { LanguageSpecificStringsDto } from 'src/app/generated/dcc/model/languageSpecificStringsDto';
import { LangTextPair } from 'src/app/generated/dcc/model/langTextPair';

@Component({
  selector: 'app-dcc-localised-string',
  templateUrl: './dcc-localised-string.component.html',
  styleUrls: ['./dcc-localised-string.component.scss']
})
export class DccLocalisedStringComponent implements OnInit, AfterContentChecked {
  @Input() strings: LanguageSpecificStringsDto;
  @Input() placeholder: string;
  @Input() templateButtonState!: boolean;
  @Input() isRequired!: boolean;

  locales = [
    { lang: "de", name: "Deutsch", icon: "fi fi-de" },
    { lang: "en", name: "Englisch", icon: "fi fi-us" },
    { lang: "fr", name: "Französisch", icon: "fi fi-fr" },
    { lang: "es", name: "Spanisch", icon: "fi fi-es" }
  ];

  languageMap = new Map<string, any>();
  // lang:string='';
  // text:string='';

  constructor(private cdref: ChangeDetectorRef) {
    this.strings = <LanguageSpecificStringsDto>{};
    this.placeholder = "";
  }

  ngOnInit(): void {

    if (!this.strings) {
      this.strings = this.getEmptyStringWithLangDto();
    }
    this.initializeLanguageMap();
  }

  ngAfterContentChecked() {
    // console.log('strings',this.strings)
    this.cdref.detectChanges();
  }

  initializeLanguageMap() {

    this.languageMap.clear();
    if (this.strings.content) {
    this.strings.content!.forEach(item => {
      if (item.lang) {
        const locale = this.locales.find(locale => locale.lang === item.lang);
        this.languageMap.set(item.lang, locale || this.locales[0]);
      }
    });
  }
  }

  getEmptyStringWithLangDto(): LanguageSpecificStringsDto {
    var result = <LanguageSpecificStringsDto>{};
    result.content = new Array<LangTextPair>;
    var preselected = <LangTextPair>{};
    preselected.lang = this.locales[0].lang;
    preselected.text = this.placeholder;
    result.content.push(preselected)
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
      const selectedLang = this.locales.find(locale => locale.lang === item.lang);
      if (selectedLang) {
        this.languageMap.set(item.lang, selectedLang);
      } else {
        this.languageMap.set(item.lang, this.locales[2]);
      }
    }
  }

  getOrSetLang(item: any): string {

    if (item.lang === '**' || item.lang === undefined) {
      item.lang = 'de';
    }
    return item.lang;
  }
}
