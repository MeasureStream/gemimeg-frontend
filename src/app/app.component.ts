import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'gemimeg-frontend';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('de');
    this.translate.addLangs(['de', 'en', 'fr', 'es']);
    this.translate.use('de');
  }
}
