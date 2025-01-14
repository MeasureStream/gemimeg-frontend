import { Component, EventEmitter, Output } from '@angular/core';

import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent {
  @Output() close = new EventEmitter<void>();

  displaylanguages: Array<Language>;
  userLanguage: string;

  constructor(private navigation: NavigationComponent) {
    this.displaylanguages = new Array<Language>;
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
    this.userLanguage = this.navigation.getUserLanguage();
  }

  ngOnInit(): void {
  }

  applyLanguage(): void {
    this.navigation.setUserLanguage(this.userLanguage);
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
