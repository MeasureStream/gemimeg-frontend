import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ErrorService } from '../services/common/error/error.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private errorDialogService: ErrorService,
    private zone: NgZone,
    private logger: NGXLogger
  ) {}

  handleError(error: any) {
    if (error) {
      this.zone.run(() => this.errorDialogService.logError(error));
  } else {
      this.logger.warn('Got unexpected error without details');
    }
  }
}
