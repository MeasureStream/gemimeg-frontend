import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationBehaviorOptions, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  public currentUrl: String | undefined;

  constructor( private router: Router, 
               @Optional() @Inject(MAT_DIALOG_DATA) public data: { message: string; status?: number, stack?: string }
              ) {
              // find out current URL
              this.currentUrl = router.getCurrentNavigation()?.finalUrl?.toString();
  }

  ngOnInit(): void {
  }
}
