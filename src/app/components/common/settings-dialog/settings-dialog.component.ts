import { Component, EventEmitter, Output } from '@angular/core';

import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent {
  @Output() close = new EventEmitter<void>();

  languages: Array<Language>;
  language: Language;

  constructor(private navigation: NavigationComponent) {
    this.languages = new Array<Language>;
    this.languages[0] = <Language>{};
    this.languages[0].name = "Deutsch";
    this.languages[0].value = "de";
    this.languages[1] = <Language>{};
    this.languages[1].name = "English";
    this.languages[1].value = "en";
    this.languages[2] = <Language>{};
    this.languages[2].name = "Français";
    this.languages[2].value = "fr";
    this.languages[3] = <Language>{};
    this.languages[3].name = "Español";
    this.languages[3].value = "es";
    this.language = this.getLanguage(this.navigation.getUserLanguage());
  }

  getLanguage(value: string): Language {
    for (let i = 0; i < this.languages.length; i++) {
      if (this.languages[i].value == value) {
        return this.languages[i];
      }
    }
    return this.languages[0];
  }

  ngOnInit(): void {
  }

  applyLanguage(): void {
    this.navigation.setUserLanguage(this.language.value);
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