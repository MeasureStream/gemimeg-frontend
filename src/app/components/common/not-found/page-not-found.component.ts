import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  public currentUrl: String | undefined;

  constructor(router: Router) {
    this.currentUrl = router.getCurrentNavigation()?.finalUrl?.toString();
  }

  ngOnInit(): void {
  }
}
