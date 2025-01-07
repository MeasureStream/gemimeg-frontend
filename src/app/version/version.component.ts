import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';

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
  appVersion: VersionResponse | any = '';
  errorMessage: string | any;
  pathPart: string | any;

  constructor(private http: HttpClient, private elementRef: ElementRef) {
    this.pathPart = this.elementRef.nativeElement.getAttribute('pathPart');
  }

  ngOnInit(): void {
    this.fetchVersion().subscribe({
      next: (responseData) => {
        this.appVersion = responseData;
        console.log(responseData);
      },
      error: (error: any) => {
        this.errorMessage = 'error fetching version:' + error.message;
        console.log('error fetching version:' + error.message);
      },
      complete: () => {
        console.log('fetch completed');
      },
    });
  }

  fetchVersion() {
    return this.http.get<any>('/api/v1/' + this.pathPart + '/version');
  }
}
