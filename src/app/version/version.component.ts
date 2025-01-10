import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { VERSION } from '@angular/core';
import * as packageJson from 'package.json';

interface VersionResponse {
  artifactId: string;
  version: string;
  timestamp: Date;
}

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss'],
})
export class VersionComponent implements OnInit {
  backendVersion: VersionResponse | any = '';
  pathPart: string | any;
  angularVersion = VERSION.full;
  frontendVersion: string = (packageJson as any).version;

  constructor(private http: HttpClient, private elementRef: ElementRef) {
    this.pathPart = this.elementRef.nativeElement.getAttribute('pathPart');
    this.updateFrontendVersion();
  }

  ngOnInit(): void {
    this.fetchBackendVersion().subscribe({
      next: (responseData) => {
        this.backendVersion = responseData;
        console.log(responseData);
      },
      error: (error: any) => {
        console.log('error fetching version:' + error.message);
      },
      complete: () => {
        console.log('fetch completed');
      },
    });
  }

  fetchBackendVersion() {
    return this.http.get<any>('/api/v1/' + this.pathPart + '/version');
  }

  updateFrontendVersion() {
    const currentVersion = (packageJson as any).version;
    if (currentVersion !== this.frontendVersion) {
      this.frontendVersion = currentVersion;
    }
  }
}
