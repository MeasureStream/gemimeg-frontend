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
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private logger: NGXLogger) {}

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
