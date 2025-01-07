import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { VERSION } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import * as packageJson from 'package.json';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  fullName = '';
  lastFrontendUpdate: string | any;
  angularVersion = VERSION.full;
  version: string = (packageJson as any).version;
  lastUpdateDate: Date | any = new Date();

  isHandset$: Observable<boolean> = this.breakpointObserver
    ?.observe(Breakpoints.Handset)
    ?.pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver
  ) {
    this.updateVersion();
    console.log('Angular version:', this.version);
  }

  ngOnInit(): void {
    this.fullName = this.keycloakService.getFullName();
  }

  updateVersion() {
    const currentVersion = (packageJson as any).version;
    if (currentVersion !== this.version) {
      this.version = currentVersion;
      this.lastUpdateDate = new Date();

    }
  }
  updateLastFrontend() {
    const currentDate = new Date();
    this.lastFrontendUpdate = currentDate.toLocaleString();
  }


}
