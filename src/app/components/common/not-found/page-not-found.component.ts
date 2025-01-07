import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  public currentUrl: String | undefined;

  constructor(  private router: Router, 
                private logger: NGXLogger
              ) {
              // find out current URL
              this.currentUrl = router.getCurrentNavigation()?.finalUrl?.toString();
              this.logger.warn("Got 404 on "+this.currentUrl);
  }

  ngOnInit(): void {
  }

}
