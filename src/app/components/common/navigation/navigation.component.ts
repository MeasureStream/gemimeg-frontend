import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  userLanguage = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0];
  fullName = '';
  isInfoDialogVisible = false;
  isSettingsDialogVisible = false;

  isHandset$: Observable<boolean> = this.breakpointObserver?.observe(Breakpoints.Handset)?.pipe(
    map((result) => result.matches),
    shareReplay()
  );

  constructor(private breakpointObserver: BreakpointObserver, private translate: TranslateService) {
    if (this.translate.langs.includes(this.userLanguage)) {
      this.translate.use(this.userLanguage);
    } else {
      this.userLanguage = 'en';
      this.translate.use('en');
    }
  }

  ngOnInit(): void {}

  openInfoDialog() {
    this.isInfoDialogVisible = true;
  }

  hideInfoDialog() {
    this.isInfoDialogVisible = false;
  }

  openSettingsDialog() {
    this.isSettingsDialogVisible = true;
  }

  hideSettingsDialog() {
    this.isSettingsDialogVisible = false;
  }

  getUserLanguage(): string {
    return this.userLanguage;
  }

  setUserLanguage(lang: string): void {
    this.userLanguage = lang;
    this.translate.use(this.userLanguage);
  }
}
