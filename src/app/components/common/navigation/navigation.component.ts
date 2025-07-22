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
