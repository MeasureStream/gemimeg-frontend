import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  userLanguage = 'de';
  fullName = '';
  isInfoDialogVisible = false;
  isSettingsDialogVisible = false;

  isHandset$: Observable<boolean> = this.breakpointObserver
    ?.observe(Breakpoints.Handset)
    ?.pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
  }

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
  }
}
