import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NGXLogger } from 'ngx-logger';
import { ErrorComponent } from 'src/app/components/common/error/error.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private dialog: MatDialog, private logger: NGXLogger) {}

  logError(error: any): void {
    var message = error;
    var status, stack;
    if (error instanceof HttpErrorResponse) {
      message = error.statusText;
      status = error.status;
      stack = error.error;
      if (stack) {
        try {
          stack = JSON.parse(stack);
          if (stack.message) stack = stack.message;
        } catch (e) {
          stack = error.error;
        }
      }
    } else if (error instanceof Error) {
      stack = message.stack;
    } else {
      this.logger.warn("Got unexpected error of type "+typeof(error)+" with structure "+JSON.stringify(error, null, 3));
    }
    this.logErrorDetails(message,status,stack);
  }

  logErrorDetails(message: string, status?: number, stack?: string): void {
    if (message != undefined || status != undefined) {
      this.logger.warn("Got error "+message+" with status "+status+" and stack "+stack);
    } else {
      this.logger.warn("Got (invisible) error "+message+" with status "+status+" and stack "+stack);
    }
  } 
}
